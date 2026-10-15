# CORREÇÃO URGENTE — 57 páginas com texto de template visível

**Achado durante a verificação do deploy.** Enquanto conferia o site publicado, encontrei
um defeito que estava no ar e que **pesa direto na reprovação do AdSense**: 57 páginas de
ferramenta exibiam texto de template não substituído.

**Projeto:** `E:\SITES\multitool`

---

## O que estava errado (visível para qualquer visitante)

Na página `/tools/text-tools/slug-generator`, por exemplo:

| Elemento | Antes (publicado) | Depois da correção |
|---|---|---|
| Título da página (`<h1>`) | `H1_Slug Generator - URL-Friendly Text \| MultiTool` | `Slug Generator` |
| Breadcrumb | `HOME / TEXT-TOOLS_NAME / TOOL` | `HOME / TEXT TOOLS / TOOL` |

Outros exemplos de breadcrumbs quebrados que estavam no ar: `math_NAME`,
`generators_NAME`, `developer-tools_NAME`, `date-time_NAME`, `converters_NAME`,
`health_NAME`, `images_NAME`, `finance_NAME`, `pdf-tools_NAME`.

Isso é exatamente o tipo de sinal que um revisor humano interpreta como
"site gerado automaticamente / inacabado" — o mesmo raciocínio por trás da reprovação
por "conteúdo de baixo valor".

## O que este pacote contém

**145 arquivos** `page.tsx` (todas as páginas de ferramenta, na versão já corrigida).
As 57 quebradas foram reparadas; as outras 88 foram incluídas para manter o conjunto
consistente (nenhuma teve conteúdo alterado além disso).

Correções aplicadas em cada página afetada:

1. `title="H1_<texto> | MultiTool"` → `title="<nome da ferramenta>"` — o H1 passa a ser
   o nome real, retirado do catálogo (`src/lib/tools.ts`), igual ao padrão das páginas
   que já estavam corretas.
2. `categoryName="<categoria>_NAME"` → `categoryName="<nome real da categoria>"`
   (`Text Tools`, `Math & Education`, `Developer Tools`, `Date & Time`,
   `Generators & Fun`, `Health & Fitness`, `Image Tools`, `Converters`, `PDF Tools`).

Nada mais foi tocado: nenhum texto de conteúdo, nenhuma diretiva de robots, nenhum
caminho de ferramenta.

---

## Publicar (PowerShell)

```powershell
$zip = (Get-ChildItem "$env:USERPROFILE\Downloads\fix-h1-breadcrumb.zip").FullName ; $zip
Expand-Archive -Path $zip -DestinationPath "E:\SITES\multitool" -Force
```

```powershell
cd E:\SITES\multitool; npm run build
```

Tem que terminar com `Compiled successfully` e gerar 190 páginas.

```powershell
cd E:\SITES\multitool; git add .; git commit -m "Fix visible template placeholders: H1_ prefix and <category>_NAME in breadcrumbs on 57 tool pages"; git push
```

---

## Conferir no ar (depois do deploy)

```powershell
curl.exe -s https://www.multitoolbox.online/tools/text-tools/slug-generator | Select-String -Pattern "<h1" | Select-Object -First 1
```

Deve mostrar `Slug Generator` no `<h1>` (sem `H1_` e sem `| MultiTool`).

Ou simplesmente abra no navegador:

- `https://www.multitoolbox.online/tools/text-tools/slug-generator`
- `https://www.multitoolbox.online/tools/math/geometry-calculator`
- `https://www.multitoolbox.online/tools/health/ideal-weight`

O título grande no topo deve ser o nome da ferramenta, e a trilha de navegação
(`HOME / … / TOOL`) deve mostrar o nome da categoria por extenso.

---

## Como isso foi verificado aqui

- Reparo aplicado por script, comparando com o catálogo (`src/lib/tools.ts`) para pegar
  os nomes reais — não por adivinhação de texto.
- **Varredura de regressão nas 145 ferramentas** do build local: 0 com `H1_` visível,
  0 com `_NAME` no breadcrumb, 0 com a marca dentro do H1, 0 sem H1, 0 com valor
  inválido (`undefined`, `NaN`).
- Build: `Compiled successfully`, 190 páginas, sem erro de tipo (`tsc` limpo).

---

## Isso muda o diagnóstico do AdSense?

Reforça o que já estava mapeado, e num ponto específico: as 57 páginas afetadas estão
**todas entre as que ficaram com `noindex`** — ou seja, nenhuma delas aparecia no
sitemap. Ainda assim, o defeito era visível para qualquer visitante que chegasse por link
interno, e é o tipo de detalhe que sustenta a leitura de "site inacabado". Corrigido,
ele sai da lista de argumentos contra o site.

O plano continua o mesmo: **Lote 2** (aprofundar 10–15 páginas por semana da
`auditoria/fila-de-trabalho.csv`, começando pelas que têm mais intenção de busca) e
reaplicar ao AdSense só depois de algumas semanas de site ativo com tudo isso publicado.
