# LEIA PRIMEIRO — Ferramenta nova: PDF to Markdown

**Ferramenta nova do MultiTool:** `/tools/pdf-tools/pdf-to-markdown`
(o inverso da que já existia: Markdown → PDF)

Tudo neste pacote é para extrair **dentro de** `C:\multitool` e publicar com
`git add . ; git commit ; git push` — a Vercel faz o deploy sozinha.

> **Não precisa rodar `npm install`.** Nenhuma dependência nova foi adicionada:
> a ferramenta usa o `pdf.js` (`pdfjs-dist`) e o `jszip`, que o projeto já tinha.

---

## 1. O que a ferramenta faz

Você solta um PDF (ou vários) e recebe **Markdown de verdade**:

- **Títulos** viram `#`, `##`, `###` (detectados pelo tamanho da fonte, medido no próprio documento);
- **Listas** com `•` ou `1.` / `a)` viram listas Markdown (listas numeradas mantêm o número original);
- **Trechos monoespaçados** viram bloco de código cercado por ``` com a **indentação original preservada**;
- **Parágrafos quebrados linha por linha** pelo PDF são remontados em texto corrido, inclusive palavras cortadas com hífen (`docu-` + `ment` → `document`);
- **Cabeçalho/rodapé repetido** em todas as páginas e número de página são removidos;
- Opções ligáveis: quebra de página (`---`), **YAML front matter** (título, arquivo de origem, nº de páginas, data), juntar linhas, etc.;
- Múltiplos PDFs de uma vez → download individual ou **ZIP** com todos os `.md`;
- Avisos honestos quando o PDF é **escaneado** (sem camada de texto), tem **colunas** ou **tabelas**;
- Tudo roda no navegador: o PDF **nunca é enviado** para servidor nenhum.

Limites declarados na própria página: PDF escaneado precisa de OCR (não roda no navegador),
tabelas saem como linhas de texto (não como tabela Markdown) e PDF com senha precisa passar
antes pelo PDF Unlock.

---

## 2. O que vem neste pacote

Arquivos **novos**:

```
src/lib/pdfToMarkdown.ts                                              (motor de conversão)
src/app/tools/pdf-tools/pdf-to-markdown/page.tsx                      (página/SEO/conteúdo)
src/app/tools/pdf-tools/pdf-to-markdown/PdfToMarkdownClient.tsx       (interface)
public/previews/pdf/pdf2md-before.jpg                                 (preview "antes")
public/previews/pdf/pdf2md-after.jpg                                  (preview "depois")
```

Arquivos **atualizados** (versão completa, pode sobrescrever):

```
src/lib/tools.ts                                       (+ entrada "pdf-to-markdown" no catálogo)
src/app/tools/pdf-tools/page.tsx                       (+ preview e contagem automática de ferramentas)
src/app/tools/pdf-tools/markdown-to-pdf/page.tsx       (+ link para a ferramenta inversa)
```

O que se atualiza sozinho depois do push (não precisa mexer):

- `/tools` (hub, com busca) — lê o catálogo;
- `sitemap.xml` — lê o catálogo (a URL nova entra automaticamente);
- breadcrumbs, JSON-LD (SoftwareApplication + FAQPage) e relacionados.

---

## 3. Passo a passo para publicar (PowerShell)

### 3.1 Baixar o zip DE NOVO e conferir o nome

```powershell
dir "$env:USERPROFILE\Downloads\multitool-pdf-to-markdown.zip"
```

Se não aparecer nada, baixe o arquivo novamente (a pasta Downloads não atualiza sozinha).

### 3.2 Fechar o VS Code (para não travar a extração) e extrair em cima do projeto

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\multitool-pdf-to-markdown.zip" -DestinationPath "C:\multitool" -Force
```

### 3.3 Conferir se os arquivos chegaram

```powershell
dir C:\multitool\src\app\tools\pdf-tools\pdf-to-markdown
```

Tem que aparecer `page.tsx` e `PdfToMarkdownClient.tsx`.

### 3.4 Conferir se o TypeScript está ok e fazer o build

```powershell
cd C:\multitool; npm run build
```

O build tem que terminar sem erro (deve aparecer `/tools/pdf-tools/pdf-to-markdown` na lista).
**Se der erro, cole o texto do erro no chat e não faça o push ainda.**

### 3.5 Publicar

```powershell
cd C:\multitool; git add .; git commit -m "Tool: PDF to Markdown (reverse of Markdown to PDF) + catalog, category preview and cross-links"; git push
```

Verifique se a saída termina com `master -> master`.

### 3.6 Conferir o deploy na Vercel

1. Abra `https://vercel.com` e entre no projeto **multitool**.
2. Menu **Deployments** → o último deploy deve ficar **Ready**.
3. Se ficar **Error**, abra o log, copie o texto do erro e cole no chat.

### 3.7 Testar a ferramenta no ar

Abra no navegador:

```text
https://www.multitoolbox.online/tools/pdf-tools/pdf-to-markdown
```

Teste com um PDF de verdade: escolha o arquivo, clique em **EXTRACT MARKDOWN**,
confira o preview e clique em **DOWNLOAD ....MD**.

---

## 4. O que já foi validado aqui (antes de você publicar)

- `npm run build` do projeto **passou** com a ferramenta nova (rota estática gerada).
- `tsc --noEmit` **sem erros**.
- Testes do motor de conversão (25 verificações): títulos por tamanho de fonte, listas com marcadores
  e numeradas, juntar linhas quebradas, remover cabeçalho/rodapé e número de página, junção de hífen,
  escape de `#` e `>` no começo de linha, avisos de PDF escaneado e de colunas, opções ligadas/desligadas.
- **Teste ponta a ponta**: geramos um PDF de 2 páginas de verdade, extraímos com o `pdf.js` (mesmo
  caminho que a ferramenta usa no navegador) e o Markdown saiu com `#`, `##`, listas, bloco de código
  com indentação preservada e parágrafos remontados.
- Página renderizada em servidor de produção local: HTTP 200, `<h1>PDF to Markdown</h1>`, canonical
  correto, FAQ schema presente, categoria com 19 ferramentas, sitemap com a URL nova.

---

## 5. Depois do deploy (opcional, mas ajuda)

1. **Search Console** → Inspeção de URL → cole
   `https://www.multitoolbox.online/tools/pdf-tools/pdf-to-markdown` → **Solicitar indexação**.
2. O `sitemap.xml` já inclui a página nova (não precisa reenviar, mas reenviar não faz mal).
3. Links internos já entram prontos: hub `/tools`, categoria `/tools/pdf-tools` e a ferramenta inversa
   `markdown-to-pdf` aponta para a nova.

---

## 6. Se algo der errado

- **Erro no `npm run build`** → cole o texto completo do erro no chat (sem print).
- **`Expand-Archive` diz que o caminho não existe** → rode `dir "$env:USERPROFILE\Downloads\*.zip"`
  e confira o nome exato do arquivo.
- **`nothing to commit, working tree clean`** → o zip não foi extraído na pasta certa; confira o passo 3.3.
- **A ferramenta abre mas não converte** → tente um PDF diferente (um que você abriu e copiou texto no
  leitor) e mande o texto do erro que aparecer na tela; PDF escaneado é avisado na própria interface.
