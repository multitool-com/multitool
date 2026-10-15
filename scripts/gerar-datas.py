#!/usr/bin/env python3
"""Regenera src/lib/contentDates.ts com a data real do último commit de cada página.

Uso:  python3 scripts/gerar-datas.py
Rodar depois de qualquer alteração nas páginas de ferramenta (git commit incluído).
"""
import os
import subprocess

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TOOLS = os.path.join(RAIZ, "src", "app", "tools")
SAIDA = os.path.join(RAIZ, "src", "lib", "contentDates.ts")


def data_git(caminho: str) -> str:
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", os.path.relpath(caminho, RAIZ)],
        capture_output=True, text=True, cwd=RAIZ,
    ).stdout.strip()
    return out or "2026-10-15"


def main() -> None:
    datas = {}
    for raiz, _, arquivos in os.walk(TOOLS):
        if "page.tsx" not in arquivos:
            continue
        if len(raiz.split(os.sep)) - len(TOOLS.split(os.sep)) == 2:
            datas[os.path.basename(raiz)] = data_git(os.path.join(raiz, "page.tsx"))

    conteudo = open(SAIDA, encoding="utf-8").read()
    inicio = conteudo.index("export const TOOL_LAST_REVIEWED")
    fim = conteudo.index("};", inicio) + 2
    corpo = "export const TOOL_LAST_REVIEWED: Record<string, string> = {\n"
    corpo += "".join(f'  "{slug}": "{data}",\n' for slug, data in sorted(datas.items()))
    corpo += "};"
    open(SAIDA, "w", encoding="utf-8").write(conteudo[:inicio] + corpo + conteudo[fim:])
    print(f"{len(datas)} ferramentas atualizadas em src/lib/contentDates.ts")


if __name__ == "__main__":
    main()
