# LEIA PRIMEIRO — Lote 0 + 1 no projeto da unidade E:

**Projeto:** `E:\SITES\multitool`
**Pacote:** `multitool-reconstruir-lote-0-1.zip`

Este pacote aplica o **Lote 0 + 1** (triagem de indexação, datas de revisão, home/about/
how-we-build reescritas, textos corrigidos) **e** garante que as duas ferramentas que nunca
foram publicadas estejam no lugar: **Word to PDF** e **Markdown Integrity Check**.

> **Ele não apaga nada.** Só adiciona e atualiza arquivos dentro de `src/`, adiciona os
> previews novos em `public/previews/pdf/` e cria as pastas `scripts/` e `auditoria/`.
> Todas as imagens e arquivos que já existem no seu projeto continuam onde estão.

---

## Passo 0 — Diagnóstico (só leitura, não altera nada)

```powershell
cd E:\SITES\multitool
=== PROJETO === ; Test-Path package.json, .git, node_modules, src\lib\indexing.ts
=== GIT === ; git log --oneline -3 ; "arquivos alterados/novos:" ; (git status --short | Measure-Object -Line).Lines
=== FERRAMENTAS PDF === ; Get-ChildItem src\app\tools\pdf-tools -Directory | Select-Object -ExpandProperty Name
```

Leia a saída assim:

| O que aparece | O que significa |
|---|---|
| `package.json: True` e `.git: True` | O projeto está aqui e íntegro ✅ |
| `src\lib\indexing.ts: True` | O Lote 0+1 **já foi aplicado** nesta cópia → pode pular para o Passo 3 |
| `word-to-pdf` e `markdown-integrity-check` na lista | As duas ferramentas novas estão presentes |
| `node_modules: False` | Precisa rodar `npm ci` (Passo 4) |
| "arquivos alterados/novos: N" | Há trabalho local **não commitado** → o Passo 2 protege isso |

**Cole a saída aqui no chat** se quiser que eu confirme antes de você seguir.

---

## Passo 1 — Entrar na pasta certa

```powershell
cd E:\SITES\multitool
```

> Se `E:` não estiver montado (pendrive/HD externo desconectado), o PowerShell responde que o
> caminho não existe. Conecte a unidade e confirme com `dir E:\SITES`.

---

## Passo 2 — Proteger o que já existe (nada pode ser perdido)

Antes de qualquer coisa, guarde o estado atual dentro do próprio Git. Assim, mesmo que algo
dê errado, dá para voltar:

```powershell
cd E:\SITES\multitool; git add -A; git commit -m "WIP: estado local antes do pacote Lote 0+1"
```

- Se aparecer `nothing to commit, working tree clean`, ótimo: não havia nada pendente.
- O commit é local por enquanto — só vai para o GitHub no Passo 6, junto com o resto.

---

## Passo 3 — Extrair o pacote por cima

```powershell
$zip = (Get-ChildItem "$env:USERPROFILE\Downloads\multitool-reconstruir-lote-0-1.zip").FullName ; $zip
```

Se imprimir o caminho do arquivo, extraia:

```powershell
Expand-Archive -Path $zip -DestinationPath "E:\SITES\multitool" -Force
```

Confira se o essencial chegou:

```powershell
dir E:\SITES\multitool\src\lib\indexing.ts, E:\SITES\multitool\src\app\tools\pdf-tools\word-to-pdf, E:\SITES\multitool\src\app\tools\pdf-tools\markdown-integrity-check
```

Devem aparecer o `indexing.ts` e as duas pastas de ferramenta.

---

## Passo 4 — Dependências

```powershell
cd E:\SITES\multitool; npm ci
```

- Só é necessário se `node_modules` **não** existia (Passo 0), ou se você mudou algo no
  `package.json` (não mudamos nada aqui).
- `npm ci` usa o `package-lock.json` e instala exatamente as versões que o site usa hoje.

---

## Passo 5 — Build (obrigatório antes do push)

```powershell
cd E:\SITES\multitool; npm run build
```

Espere `Compiled successfully` e, na lista de rotas:

```
├ ○ /tools/pdf-tools/word-to-pdf
├ ○ /tools/pdf-tools/markdown-integrity-check
```

> **Nota sobre a unidade externa:** o build fica mais lento em HD/pendrive USB do que no
> disco interno (pode passar de 1 minuto). Lentidão não é erro — só espere terminar.

**Se der erro, cole o texto completo no chat e não faça o push.**

---

## Passo 6 — Publicar

```powershell
cd E:\SITES\multitool; git add .; git commit -m "AdSense batch 1: indexing triage (noindex on thin pages, sitemap 182->57), real review dates from git history, rewritten home/about/how-we-build, stale copy fixed"; git push
```

Se o Git reclamar de conta errada (403): **Gerenciador de Credenciais → Credenciais do
Windows → `git:https://github.com`** → remover → rodar o `git push` de novo.

---

## Passo 7 — Conferir no ar (5 testes)

1. `https://www.multitoolbox.online/sitemap.xml` → **57 URLs** (`Ctrl+U`, conte os `<loc>`).
2. `view-source:` de `/tools/pdf-tools/word-to-pdf` → `content="index, follow"`.
3. `view-source:` de `/tools/games/pixel-pong` → `content="noindex, follow"`.
4. Qualquer ferramenta → linha `LAST REVIEWED <data> · EVERY TOOL RUNS LOCALLY IN YOUR BROWSER`.
5. `/tools/pdf-tools/word-to-pdf` abre e converte um .docx de teste.

Depois: **Search Console → Sitemaps → reenviar** o `sitemap.xml`.

---

## ⚠️ Uma coisa que NÃO rodar

**Não execute `node generate-pages.mjs` agora.** Esse script (que já existe no seu projeto)
regenera as páginas de categoria a partir de uma lista antiga escrita dentro dele — ele
**apagaria a diretiva de indexação** que este pacote adicionou nas categorias e traria
ferramentas antigas de volta. Se em algum momento precisar dele, me avise antes.

---

## O que tem dentro do pacote

```
src/                                   (todo o código, na versão auditada e compilando)
  lib/indexing.ts                      ← triagem: o que o Google pode indexar
  lib/contentDates.ts                  ← data real de revisão de cada ferramenta (do Git)
  lib/wordDocument.ts · wordPdfWriter.ts · xmlLite.ts · cfbReader.ts   ← motor Word → PDF
  lib/markdownIntegrity.ts · pdfPagesToText.ts                         ← comparação PDF × Markdown
  app/tools/pdf-tools/word-to-pdf/                 ← ferramenta que nunca foi publicada
  app/tools/pdf-tools/markdown-integrity-check/    ← ferramenta que nunca foi publicada
  app/page.tsx (home reescrita) · about · how-we-build · sitemap.ts · ToolLayout.tsx
public/previews/pdf/word-*.jpg · integrity-*.jpg · pdf2md-*.jpg
scripts/gerar-datas.py                 ← regenera as datas de revisão (rodar após mudanças)
auditoria/AUDITORIA-ADSENSE-multitoolbox.md   ← o relatório completo da varredura
auditoria/fila-de-trabalho.csv                ← as 182 páginas com prioridade e ação
auditoria/crawl.py · analise.py                ← a varredura, para medir de novo depois
```

---

## Depois do push: os próximos passos

**Lote 2 (o que destrava a aprovação):** aprofundar 10–15 páginas por semana, começando
pelas mais finas de `auditoria/fila-de-trabalho.csv`. Cada página precisa de:

- 700+ palavras de conteúdo próprio;
- 1 imagem própria (print da ferramenta com resultado real);
- 1 exemplo resolvido com números reais + 1 tabela de referência;
- seção de limites ("quando não usar");
- aí sim: mover o slug para `INDEXABLE_TOOL_SLUGS` em `src/lib/indexing.ts` e rodar
  `python3 scripts/gerar-datas.py`.

**Lote 4:** não reaplicar ao AdSense antes de 4–6 semanas de site ativo com as mudanças
publicadas — e, no pedido de revisão, descrever o que foi corrigido.

**Backup:** como o projeto está em unidade externa e o AdSense está em jogo, vale manter o
hábito de `git push` ao fim de cada sessão de trabalho — o GitHub é a cópia de segurança, e
a Vercel publica a partir dele.
