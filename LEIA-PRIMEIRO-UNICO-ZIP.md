# CORREÇÃO ÚNICA — MultiTool AdSense + Encurtador de URL

Este zip contém **tudo em um único pacote** para aplicar no seu projeto local em
`E:\SITES\multitool`. Não é preciso baixar partes separadas.

---

## O que este zip contém

| Item | O que é | Situação |
|------|---------|----------|
| **145 páginas de ferramenta** | Todas as `page.tsx` de `src/app/tools/<categoria>/<slug>/` | ✅ Corrigidas: zero `H1_` no `<h1>`, zero `_NAME` no breadcrumb |
| **`src/lib/indexing.ts`** | Triagem de indexação (fonte única da verdade) | ✅ 32 ferramentas indexáveis, categorias `noindex` |
| **`src/lib/contentDates.ts`** | Datas reais de revisão por ferramenta | ✅ Inclui `url-shortener` |
| **`src/app/sitemap.ts`** | Sitemap filtrado (só o que é indexável) | ✅ 57 URLs no total |
| **`src/app/robots.ts`** | `robots.txt` liberado para AdSense/Googlebot | ✅ OK |
| **`src/app/api/shorten/route.ts`** | API serverless do encurtador (chama cleanuri.com) | ✅ Nova ferramenta |
| **`url-shortener`** | Página completa do encurtador de URL | ✅ Incluída como `noindex, follow` |
| **Páginas institucionais** | Home, About, How-we-build, guias, etc. | ✅ Aprofundadas (Lote 0+1) |
| **`scripts/gerar-datas.py`** | Script para regenerar datas de revisão | ✅ Incluído |
| **`auditoria/`** | Relatório, fila-de-trabalho.csv, scripts | ✅ Incluído |

---

## O que foi corrigido (detalhe)

1. **Placeholders visíveis** — As 57 páginas que estavam com `H1_...` no `<h1>` e `<categoria>_NAME` no breadcrumb foram reparadas. As outras 88 páginas de ferramenta foram incluídas no mesmo pacote para manter o conjunto consistente. Nenhuma outra alteração de conteúdo foi feita.

2. **Encurtador de URL** — A ferramenta já está pronta em:
   - `src/app/tools/developer-tools/url-shortener/page.tsx`
   - `src/app/tools/developer-tools/url-shortener/UrlShortenerClient.tsx`
   - `src/app/api/shorten/route.ts`

   Ela funciona enviando a URL para o cleanuri.com (serviço externo, sem banco de dados próprio). O histórico fica apenas no `sessionStorage` do navegador.

   **Importante para o AdSense:** o `url-shortener` está com `noindex, follow` (não está na lista dos 32 indexáveis). Isso significa que a página funciona para os usuários, mas **não entra no sitemap nem no índice do Google** até você aprofundá-la (Lote 2). Isso é intencional: não aumenta a superfície de conteúdo fino.

---

## O que NÃO está neste zip (e por quê)

- **Lote 2 (aprofundamento de páginas):** as 113 páginas que continuam com `noindex` precisam ser aprofundadas uma a uma (700+ palavras, imagem própria, exemplo numérico, tabela, limitações, data). Isso é trabalho manual que não pode ser automatizado com segurança — gerar texto em massa com IA é classificado pelo Google como "abuso de conteúdo em escala" e pode prejudicar ainda mais a aprovação.
- **Reaplicação ao AdSense:** não faça isso ainda. O site precisa de pelo menos 4–6 semanas ativo com as mudanças publicadas.

---

## Como aplicar (PowerShell, Windows)

Extraia o zip direto sobre o projeto existente. O comando `-Force` sobrescreve os arquivos antigos.

```powershell
# 1. Confira onde está o zip
$zip = (Get-ChildItem "$env:USERPROFILE\Downloads\multitool-correcao-unica.zip").FullName
$zip

# 2. Extraia sobre o projeto (unidade externa E:)
Expand-Archive -Path $zip -DestinationPath "E:\SITES\multitool" -Force

# 3. Entre na pasta e rode o build
cd E:\SITES\multitool
npm run build
```

O build deve terminar com `Compiled successfully` e gerar **190 páginas** (ou próximo a isso, dependendo de guias/rotas dinâmicas). Se aparecer erro, **não use Ctrl+C** — cole o texto do erro aqui para eu ajudar.

**Nota sobre unidade externa:** `npm ci` / `npm run build` podem demorar mais no `E:` porque gravam muitos arquivos pequenos em `node_modules` e o Windows Defender pode escanear cada um. Deixe terminar.

```powershell
# 4. Commit e push (se usar Git)
git add .
git commit -m "Correção única: placeholders H1_/_NAME corrigidos, encurtador de URL incluído (noindex), Lote 0+1 mantido"
git push
```

---

## Como verificar depois do deploy

Abra o navegador e confira estas páginas:

| Página | O que deve aparecer |
|--------|---------------------|
| `https://www.multitoolbox.online/tools/text-tools/slug-generator` | `<h1>` = `Slug Generator` (sem `H1_`); breadcrumb = `TEXT TOOLS` (sem `_NAME`) |
| `https://www.multitoolbox.online/tools/math/geometry-calculator` | `<h1>` = `Geometry Calculator`; breadcrumb = `MATH & EDUCATION` |
| `https://www.multitoolbox.online/tools/developer-tools/url-shortener` | Página do encurtador funciona; `<h1>` = `URL Shortener`; breadcrumb = `DEVELOPER TOOLS` |
| `https://www.multitoolbox.online/sitemap.xml` | 57 URLs (o `url-shortener` **não** aparece, porque está `noindex`) |

No PowerShell, para conferir o `<h1>` de uma página publicada:

```powershell
curl.exe -s "https://www.multitoolbox.online/tools/text-tools/slug-generator?v=$(Get-Date -UFormat %s)" | Select-String -Pattern "<h1" | Select-Object -First 1
```

---

## Avisos importantes

1. **Não rodar `node generate-pages.mjs`** sem revisar antes. Esse script tem dados antigos e pode sobrescrever páginas/categorias e apagar as diretivas de indexação (`noindex`) que acabamos de consertar.

2. **Não adicionar mais ferramentas novas agora.** Cada URL nova aumenta a superfície de conteúdo fino antes de resolver a profundidade das existentes.

3. **Não reaplicar ao AdSense antes de 4–6 semanas** com o site ativo e as correções publicadas. O Google precisa ver presença consistente.

4. **O encurtador usa um serviço externo (cleanuri.com).** Se quiser um encurtador próprio com redirecionamento real (301) e banco de dados, avise — é uma etapa separada que exige backend.

---

## Próximo passo (quando quiser)

Quando estiver pronto para o **Lote 2**, abra `auditoria/fila-de-trabalho.csv`, escolha as páginas mais finas/com mais intenção de busca, aprofunde cada uma (700+ palavras, imagem, exemplo, tabela, limitações, data), mova o slug para `INDEXABLE_TOOL_SLUGS` em `src/lib/indexing.ts`, rode `python3 scripts/gerar-datas.py`, build, commit, push.

---

**Arquivo gerado:** `multitool-correcao-unica.zip`  
**Aplique em:** `E:\SITES\multitool`  
**Não use:** `C:\multitool` (caminho antigo, estava vazio)