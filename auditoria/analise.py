#!/usr/bin/env python3
"""
Análise aprofundada sobre o resultado do crawl:
  - agrupa por tipo de página (ferramenta, categoria, hub, guia, institucional)
  - mede a fração de texto que se repete em 5-gramas (fórmula de template)
  - verifica status HTTP de cada URL do sitemap
  - mede quantas palavras são "únicas" por página em 5-gramas
  - detecta páginas com estrutura idêntica (mesma sequência de títulos)
Gera: auditoria-detalhada.json e auditoria-por-tipo.txt
"""
import json
import re
import urllib.request
from collections import Counter, defaultdict
from html.parser import HTMLParser

BASE = "http://localhost:3000"
SHINGLE = 5
DUP = 3


class Extract(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.boiler = 0
        self.skip = 0
        self.text = []
        self.h2s = []
        self.in_h2 = False
        self.h2buf = ""

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("header", "footer"):
            self.boiler += 1
        if tag in ("script", "style"):
            self.skip += 1
        if tag == "h2":
            self.in_h2 = True
            self.h2buf = ""

    def handle_endtag(self, tag):
        if tag in ("header", "footer") and self.boiler:
            self.boiler -= 1
        if tag in ("script", "style") and self.skip:
            self.skip -= 1
        if tag == "h2":
            self.in_h2 = False
            self.h2s.append(self.h2buf.strip())

    def handle_data(self, data):
        if self.skip or self.boiler:
            return
        self.text.append(data)
        if self.in_h2:
            self.h2buf += data


def fetch(url):
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:
        return 0, ""


def text_of(html):
    t = " ".join(html.split())
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", t))


def toc(text):
    return [w.lower() for w in re.findall(r"[A-Za-zÀ-ÿ0-9']+", text)]


def page_type(path):
    if path.startswith("/tools/") and path.count("/") == 3:
        return "ferramenta"
    if path.startswith("/tools/") and path.count("/") == 2:
        return "categoria"
    if path == "/tools":
        return "hub"
    if path.startswith("/guides/"):
        return "guia"
    return "institucional"


def main():
    sitemap = urllib.request.urlopen(f"{BASE}/sitemap.xml", timeout=30).read().decode()
    urls = [u.replace("https://www.multitoolbox.online", "") or "/" for u in re.findall(r"<loc>([^<]+)</loc>", sitemap)]

    pages = {}
    grams_all = Counter()
    for path in urls:
        status, html = fetch(f"{BASE}{path}")
        parser = Extract()
        parser.feed(html)
        text = text_of(" ".join(parser.text))
        tokens = toc(text)
        grams = {" ".join(tokens[i : i + SHINGLE]) for i in range(max(0, len(tokens) - SHINGLE + 1))}
        grams_all.update(grams)
        pages[path] = {
            "status": status,
            "palavras": len(tokens),
            "h2": parser.h2s,
            "gramas": grams,
        }

    by_type = defaultdict(list)
    for path, data in pages.items():
        tokens_count = data["palavras"]
        repetidas = sum(1 for g in data["gramas"] if grams_all[g] >= DUP)
        total = max(1, len(data["gramas"]))
        unicas_palavras = round(tokens_count * (total - repetidas) / total)
        data.update(
            {
                "tipo": page_type(path),
                "gramas_total": total,
                "gramas_repetidas": repetidas,
                "pct_formula": round(repetidas / total, 3),
                "palavras_unicas_est": unicas_palavras,
                "h2_assinatura": " | ".join(data["h2"][:8]),
            }
        )
        by_type[data["tipo"]].append(data)

    resumo_tipo = {}
    for tipo, items in by_type.items():
        palavras = sorted(i["palavras"] for i in items)
        unicas = sorted(i["palavras_unicas_est"] for i in items)
        resumo_tipo[tipo] = {
            "paginas": len(items),
            "palavras_mediana": palavras[len(palavras) // 2],
            "palavras_min": palavras[0],
            "palavras_max": palavras[-1],
            "palavras_unicas_mediana": unicas[len(unicas) // 2],
            "pct_formula_mediana": round(sum(i["pct_formula"] for i in items) / len(items), 3),
        }

    # estruturas idênticas (mesma assinatura de H2) — sinal de página em série
    assinaturas = Counter(i["h2_assinatura"] for i in pages.values() if i["tipo"] == "ferramenta")
    assinatura_top = assinaturas.most_common(5)

    status_counts = Counter(i["status"] for i in pages.values())
    sem_status_200 = {p: i["status"] for p, i in pages.items() if i["status"] != 200}

    ordenado = sorted(pages.items(), key=lambda kv: kv[1]["palavras_unicas_est"])
    resultado = {
        "resumo_por_tipo": resumo_tipo,
        "status_http": dict(status_counts),
        "urls_sem_200": sem_status_200,
        "assinaturas_h2_ferramentas_mais_comuns": assinatura_top,
        "top_20_mais_finas": [
            {
                "url": p,
                "tipo": d["tipo"],
                "palavras": d["palavras"],
                "palavras_unicas_est": d["palavras_unicas_est"],
                "pct_formula": d["pct_formula"],
            }
            for p, d in ordenado[:20]
        ],
        "paginas_com_menos_400_palavras_unicas": [
            p for p, d in ordenado if d["palavras_unicas_est"] < 400
        ],
        "total_paginas": len(pages),
    }

    with open("auditoria-detalhada.json", "w", encoding="utf-8") as fh:
        json.dump(
            {
                **resultado,
                "paginas": {
                    p: {k: v for k, v in d.items() if k != "gramas"} for p, d in pages.items()
                },
            },
            fh,
            ensure_ascii=False,
            indent=2,
        )

    with open("auditoria-por-tipo.txt", "w", encoding="utf-8") as fh:
        for tipo, resumo in sorted(resumo_tipo.items(), key=lambda kv: -kv[1]["paginas"]):
            fh.write(
                f"{tipo}: {resumo['paginas']} páginas | palavras mediana {resumo['palavras_mediana']} "
                f"(min {resumo['palavras_min']}, max {resumo['palavras_max']}) | "
                f"únicas (5-gramas) {resumo['palavras_unicas_mediana']} | "
                f"texto de fórmula {resumo['pct_formula_mediana'] * 100:.0f}%\n"
            )

    print(json.dumps(resultado, ensure_ascii=False, indent=2)[:6000])


if __name__ == "__main__":
    main()
