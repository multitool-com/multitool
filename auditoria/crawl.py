#!/usr/bin/env python3
"""
Auditoria de conteúdo do site (varredura completa).

Para cada URL do sitemap:
  - extrai o texto do <main> (conteúdo real, sem header/footer/menu)
  - conta palavras do conteúdo, palavras dentro de acordeões (FAQ <details>)
  - mede quanto do texto é boilerplate repetido em outras páginas (shingles de 8 palavras)
  - registra título, meta description, canonical, nº de links internos, imagens
  - detecta placeholders ("coming soon"), páginas sem conteúdo único
Gera:
  - auditoria-paginas.csv
  - auditoria-resumo.json
  - auditoria-frases-repetidas.txt
"""
import csv
import json
import re
import sys
import time
import urllib.request
from collections import Counter, defaultdict
from html.parser import HTMLParser

BASE = "http://localhost:3000"
SHINGLE = 8          # tamanho do shingle (palavras)
MIN_SHINGLE_DUP = 3  # aparece em 3+ páginas = boilerplate

class PageExtractor(HTMLParser):
    """Separa conteúdo (fora de header/footer) do boilerplate (header + footer).

    O Next.js entrega a página em streaming: o HTML traz um esqueleto de
    carregamento dentro de <main> e o conteúdo real em divs ocultos. Por isso
    não basta ler o <main> — o critério é "tudo que não é header/footer".
    """
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.boiler_depth = 0     # dentro de header/footer
        self.content_parts = []
        self.boiler_parts = []
        self.title = ""
        self.in_title = False
        self.description = ""
        self.canonical = ""
        self.robots = ""
        self.h1 = []
        self.in_h1 = False
        self.h2 = 0
        self.h3 = 0
        self.details_text = []
        self.in_details = 0
        self.links = 0
        self.images = 0
        self.jsonld = []
        self.in_script_ld = False
        self.script_buf = []
        self.tables = 0
        self.skip_depth = 0   # dentro de <script>/<style> (payload do Next.js)
        self.hidden_stream_parts = []
        self.in_hidden_stream = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("header", "footer"):
            self.boiler_depth += 1
        if tag == "title":
            self.in_title = True
        if tag == "meta" and a.get("name") == "description":
            self.description = a.get("content", "")
        if tag == "meta" and a.get("name") == "robots":
            self.robots = a.get("content", "")
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href", "")
        if tag == "h1":
            self.in_h1 = True
        if tag == "h2":
            self.h2 += 1
        if tag == "h3":
            self.h3 += 1
        if tag == "details":
            self.in_details += 1
        if tag == "table":
            self.tables += 1
        if tag == "a":
            self.links += 1
        if tag == "img":
            self.images += 1
        if tag == "div" and "hidden" in a and (a.get("id", "").startswith("S:")):
            self.in_hidden_stream += 1
        if tag in ("script", "style"):
            self.skip_depth += 1
        if tag == "script" and a.get("type") == "application/ld+json":
            self.in_script_ld = True
            self.script_buf = []

    def handle_endtag(self, tag):
        if tag in ("header", "footer") and self.boiler_depth:
            self.boiler_depth -= 1
        if tag == "title":
            self.in_title = False
        if tag == "h1":
            self.in_h1 = False
        if tag == "details" and self.in_details:
            self.in_details -= 1
        if tag == "div" and self.in_hidden_stream:
            self.in_hidden_stream -= 1
        if tag in ("script", "style") and self.skip_depth:
            self.skip_depth -= 1
        if tag == "script" and self.in_script_ld:
            self.in_script_ld = False
            self.jsonld.append("".join(self.script_buf))

    def handle_data(self, data):
        if self.skip_depth:
            return
        if self.boiler_depth:
            self.boiler_parts.append(data)
        else:
            self.content_parts.append(data)
            if self.in_details:
                self.details_text.append(data)
            if self.in_hidden_stream:
                self.hidden_stream_parts.append(data)
        if self.in_title:
            self.title += data
        if self.in_h1:
            self.h1.append(data.strip())
        if self.in_script_ld:
            self.script_buf.append(data)


def fetch(url, retries=3):
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(url, timeout=30) as response:
                return response.read().decode("utf-8", "replace")
        except Exception as exc:  # noqa: BLE001
            if attempt == retries - 1:
                print(f"  !! falha em {url}: {exc}", file=sys.stderr)
                return ""
            time.sleep(0.4)
    return ""


TAG_RE = re.compile(r"<[^>]+>")
WS_RE = re.compile(r"\s+")

def html_to_text(html: str) -> str:
    html = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<br\s*/?>", "\n", html, flags=re.I)
    html = re.sub(r"</(p|div|li|h[1-6]|tr|section|details)>", "\n", html, flags=re.I)
    text = TAG_RE.sub(" ", html)
    text = text.replace("&nbsp;", " ").replace("&amp;", "&").replace("&#x27;", "'")
    text = text.replace("&quot;", '"').replace("&lt;", "<").replace("&gt;", ">")
    return WS_RE.sub(" ", text).strip()


def words(text: str) -> int:
    return len([w for w in re.split(r"\s+", text) if w.strip(" •·-–—|")])


def shingles(text: str, size: int = SHINGLE) -> list[str]:
    toks = [w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ0-9']+", text)]
    return [" ".join(toks[i : i + size]) for i in range(max(0, len(toks) - size + 1))]


def main():
    sitemap = fetch(f"{BASE}/sitemap.xml")
    urls = re.findall(r"<loc>([^<]+)</loc>", sitemap)
    print(f"sitemap: {len(urls)} URLs")

    pages = []
    all_shingles = Counter()

    for index, url in enumerate(urls, 1):
        path = url.replace("https://www.multitoolbox.online", "") or "/"
        html = fetch(f"{BASE}{path}")
        if not html:
            continue
        parser = PageExtractor()
        parser.feed(html)
        content_html = "".join(parser.content_parts)
        text = html_to_text(content_html)
        faq_text = html_to_text(" ".join(parser.details_text)) if parser.details_text else ""
        stream_text = html_to_text(" ".join(parser.hidden_stream_parts)) if parser.hidden_stream_parts else ""
        sh = shingles(text)
        all_shingles.update(set(sh))
        pages.append(
            {
                "url": path,
                "title": WS_RE.sub(" ", parser.title).strip(),
                "description": parser.description,
                "canonical": parser.canonical,
                "robots": parser.robots,
                "h1": " | ".join(parser.h1),
                "h2_count": parser.h2,
                "h3_count": parser.h3,
                "tables": parser.tables,
                "links": parser.links,
                "images": parser.images,
                "words_content": words(text),
                "words_faq": words(faq_text),
                "words_stream_content": words(stream_text),
                "shingles": sh,
                "text": text,
                "jsonld_types": [
                    (re.search(r'"@type"\s*:\s*"([^"]+)"', block) or [None, "?"])[1]
                    for block in parser.jsonld
                ],
            }
        )
        if index % 25 == 0:
            print(f"  ... {index}/{len(urls)}")

    # ---- duplicação: quanto de cada página é texto repetido em 3+ páginas ----
    for page in pages:
        repeated = sum(1 for s in page["shingles"] if all_shingles[s] >= MIN_SHINGLE_DUP)
        page["shingles_total"] = len(page["shingles"])
        page["shingles_repeated"] = repeated
        page["unique_ratio"] = (
            round(1 - repeated / len(page["shingles"]), 3) if page["shingles"] else 0.0
        )
        total = page["shingles_total"] or 1
        page["dup_words_est"] = round(page["words_content"] * repeated / total)
        page["unique_words_est"] = page["words_content"] - page["dup_words_est"]

    # ---- frases mais repetidas (sentenças idênticas) ----
    sentence_pages = defaultdict(set)
    for page in pages:
        for sentence in re.split(r"(?<=[.!?])\s+", page["text"]):
            sentence = sentence.strip()
            if 40 <= len(sentence) <= 300:
                sentence_pages[sentence].add(page["url"])
    repeated_sentences = sorted(
        ((s, len(u)) for s, u in sentence_pages.items() if len(u) >= 5),
        key=lambda item: -item[1],
    )

    # ---- resumo ----
    words_list = sorted(p["words_content"] for p in pages)
    def pct(values, q):
        return values[min(len(values) - 1, int(len(values) * q))] if values else 0

    summary = {
        "urls_no_sitemap": len(urls),
        "paginas_analisadas": len(pages),
        "palavras_conteudo_mediana": pct(words_list, 0.5),
        "palavras_conteudo_media": round(sum(words_list) / len(words_list)) if words_list else 0,
        "páginas_menos_300_palavras": sum(1 for w in words_list if w < 300),
        "páginas_menos_500_palavras": sum(1 for w in words_list if w < 500),
        "páginas_menos_700_palavras": sum(1 for w in words_list if w < 700),
        "páginas_abaixo_de_30pct_unico": sum(1 for p in pages if p["unique_ratio"] < 0.30),
        "páginas_acima_de_60pct_unico": sum(1 for p in pages if p["unique_ratio"] > 0.60),
        "mediana_palavras_unicas_estimadas": pct(sorted(p["unique_words_est"] for p in pages), 0.5),
        "frases_repetidas_em_5+_paginas": len(repeated_sentences),
        "paginas_sem_h1": sum(1 for p in pages if not p["h1"]),
        "paginas_com_h2_zero": sum(1 for p in pages if p["h2_count"] == 0),
        "descricoes_duplicadas": len(pages) - len({p["description"] for p in pages}),
        "titulos_duplicados": len(pages) - len({p["title"] for p in pages}),
        "paginas_noindex": [p["url"] for p in pages if "noindex" in p["robots"]],
        "paginas_com_coming_soon": [p["url"] for p in pages if "coming soon" in p["text"].lower()],
    }

    with open("auditoria-paginas.csv", "w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh, delimiter=";")
        writer.writerow([
            "url", "palavras_conteudo", "palavras_faq", "palavras_unicas_est", "palavras_repetidas_est",
            "pct_unico", "h1", "h2", "links", "imagens", "title", "description",
        ])
        for page in sorted(pages, key=lambda p: p["unique_words_est"]):
            writer.writerow([
                page["url"], page["words_content"], page["words_faq"], page["unique_words_est"],
                page["dup_words_est"], page["unique_ratio"], page["h1"], page["h2_count"],
                page["links"], page["images"], page["title"], page["description"],
            ])

    with open("auditoria-resumo.json", "w", encoding="utf-8") as fh:
        json.dump({**summary, "paginas": [
            {k: v for k, v in p.items() if k not in ("shingles", "text", "jsonld_types")}
            for p in sorted(pages, key=lambda p: p["unique_words_est"])
        ]}, fh, ensure_ascii=False, indent=2)

    with open("auditoria-frases-repetidas.txt", "w", encoding="utf-8") as fh:
        for sentence, count in repeated_sentences[:120]:
            fh.write(f"[{count} páginas] {sentence}\n")

    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
