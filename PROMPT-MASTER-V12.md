# 🚀 PROMPT DE CONTINUIDADE — MULTITOOL (v12 — EDIÇÃO ARQUIVO/PANORAMA COMPLETO)

**Data deste snapshot: 04/09/2026 (tarde) — imediatamente após enviar o site para revisão do AdSense**
**Cole este arquivo no início de um chat novo. É a fonte da verdade. O usuário é iniciante. Siga à risca.**
**Esta é a edição "panorama completo" (para backup externo do usuário) — contém histórico integral + estado atual + todos os procedimentos operacionais.**

**Este prompt trata EXCLUSIVAMENTE do projeto MultiTool. (Existe outro projeto paralelo — Revista Casa Nova — com prompt master próprio; NÃO misturar. O usuário TEM 2 CONTAS GITHUB no mesmo PC — ver L28.)**

**NÃO apague nem recrie do zero tools READY. Sempre parta do catálogo. Se for mandar `tools.ts`, mande o arquivo INTEIRO (130 entradas, incluindo giveaway-picker e os 14 jogos com `image`).**

---

## 1. 🎯 OBJETIVO E MODELO

Site global de tools gratuitas em **INGLÊS**: **https://www.multitoolbox.online**
Next.js **16.3** (App Router) + TypeScript + Tailwind **v4**. Vercel (app, plano Hobby) + Hostinger (apenas domínio/DNS).
Arquitetura: tools 100% client-side (privacidade como diferencial de marca). Conteúdo: ferramentas + guias (estratégia "profundidade por intenção" contra boilerplate).
Monetização: **AdSense ENVIADO PARA REVISÃO em 04/09/2026** (mesma conta do YouTube do usuário — ganhos somam no limite de US$100) + afiliados (futuro).

**Identidade de marca:** "Privacy-First" (nunca promessa absoluta — ver L25). Free. Fast. Private.

---

## 2. 🌐 CONTAS / AMBIENTE / CREDENCIAIS

| Item | Valor / Estado |
|---|---|
| Domínio | multitoolbox.online (Hostinger; renovação AUTO OFF; expira 12/08/2027 ~R$197,99) |
| Canonical | `https://www.multitoolbox.online` (com www; redirect apex→www consistente) |
| Email do projeto | multitool.com@gmail.com |
| GitHub | **multitool-com/multitool** (público, branch master) — conta multitool-com |
| ⚠️ 2ª conta GitHub | **revistacasa** (projeto paralelo) — se der 403 no push, ver L28 |
| Vercel | multitoolcom-6711 / projeto "multitool" / Hobby / backup: multitool-mu.vercel.app |
| Local | `C:\multitool` (Windows + VS Code) — dev: `npm run dev` porta 3000 |
| GA4 | `G-M03VJPSYZZ` (via PageViewSanitizer — ver seção 10) |
| Search Console | Domínio verificado — TXT `google-site-verification=bmPXHsHy6C5LgUU38FFAS05LSiCamLz-AKj6_5aY9AY` (**NÃO REMOVER**) |
| **AdSense** | **pub-9130344238396108** — conta do YouTube do usuário (OUTRO email, nome/CPF do usuário) — **site em revisão desde 04/09/2026**; script no layout + `/ads.txt` no ar; **CMP do Google (2 botões) escolhida**; editável em Configurações → Privacidade e mensagens |
| PWA | manifest `display: "browser"` (sem prompt de instalação — NÃO religar) |

**Deploy:** `cd C:\multitool; git add .; git commit -m "..."; git push` (jeito B, `;` numa linha). VS Code FECHADO antes de extrair zip. Zip sempre baixado DE NOVO (Downloads não atualiza sozinho). Se `package.json` mudou → `npm install` antes do push. Verificar "master -> master" na saída. Status do deploy: `api.github.com/repos/multitool-com/multitool/deployments/<id>/statuses`.

---

## 3. 📦 ESTRUTURA DE ARQUIVOS

```
C:\multitool\
├── content/guides/*.md              ← 11 GUIAS (fonte do conteúdo; pipeline MD)
├── public/
│   ├── hero.jpg (191KB) + hero.webp (127KB)
│   ├── games/*.jpg                  ← 14 capas otimizadas (~86-128KB, 768px)
│   └── ads.txt                      ← google.com, pub-9130344238396108, DIRECT, f08c47fec0942fa0
├── src/app/
│   ├── layout.tsx                   → header/footer + script AdSense + <PageViewSanitizer/> + next/font
│   ├── page.tsx                     → hero (picture/webp/fetchPriority + preload) + categorias + teaser "From our guides" (3 mais novos por data)
│   ├── tools/page.tsx + ToolsHubClient.tsx  → HUB /tools (busca+filtros+129→130 cards, badges NEW nas 12 do lote 5)
│   ├── guides/page.tsx + [slug]/page.tsx    → índice + artigo (CTA tools, JSON-LD Article)
│   ├── tools/[cat]/page.tsx ×12     → categorias (títulos próprios)
│   ├── tools/[cat]/[slug]/          → page.tsx (Server) + [Nome]Client.tsx ("use client")
│   ├── about · contact · cookies · disclaimer · privacy (§External Services) · search (noindex) · terms
│   ├── sitemap.ts (162 URLs) · robots.ts · not-found.tsx · loading.tsx · manifest.ts · icon.svg
├── src/components/
│   ├── SiteHeader.tsx               → hamburger + "All" + "Guides" (accent-soft)
│   ├── ToolLayout.tsx               → H1/howItWorks/FAQs(schema FAQPage)/related (contraste AA)
│   ├── PageViewSanitizer.tsx        → GA4 bootstrap oficial + pageviews sanitizados + gtag adiado
│   └── PostCard.tsx? (não — isso é Casa Nova; aqui não existe)
├── src/lib/
│   ├── tools.ts                     → CATÁLOGO (130 entradas) — SEMPRE arquivo inteiro
│   ├── guides.ts                    → leitor MD dos guias (gray-matter + marked)
│   ├── analytics.ts                 → trackToolUsed/trackDownload/trackCopy (só literais!)
│   └── sudoku.ts                    → engine do sudoku (gerador solução única + solver)
└── package.json etc.
```

**Dependências instaladas (NÃO reinstalar):** `pdf-lib`, `@cantoo/pdf-lib`, `jszip`, `pdfjs-dist`, `qrcode`, `heic2any`, `exifr`, `sql-formatter`, `xml-formatter`, `yaml`, `gray-matter`, `marked` + dev: `esbuild`, `@types/*`, tailwind v4, next 16.3, react 19.2.8, typescript 5.

---

## 4. 🎨 DESIGN SYSTEM

- **Cores (globals.css @theme):** paper `#f5f6f4` · ink `#1c1f1d` · deep `#10403b` · accent `#ff5f1f` · **accent-deep `#c2410c`** (texto accent sobre fundo claro) · **accent-soft `#ffb08a`** (sobre fundo escuro)
- **Fontes:** `next/font` self-hosted — Inter (400/500/600) + Space Grotesk (600/700) + JetBrains Mono (500/600), variáveis `--font-inter-nf/--font-grotesk-nf/--font-jetbrains-nf`, display swap. **NUNCA `@import` do Google Fonts** (L29)
- **Contraste AA obrigatório em tudo:** textos pequenos ≥ `ink/70`; links com underline SEMPRE; accent-deep/soft conforme fundo (L26b)
- Padrões: card `bg-white border border-ink/10 rounded-xl p-6 shadow-sm` · pill ativo `bg-deep text-paper` · input `border border-ink/15 rounded-lg px-3 py-2.5 font-mono focus:ring-2 focus:ring-accent` · visor `bg-deep text-accent font-mono` ("—" se inválido) · botão `bg-deep text-paper font-mono text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-accent`
- **Jogos:** tema escuro/neon coerente com a capa (`public/games/<slug>.jpg`) + som Web Audio + touch + dificuldade real

---

## 5. 📐 PADRÕES DE FÁBRICA

### 5.1 Toda tool
- `page.tsx` (Server): metadata (title com "| MultiTool" **1×**, description, keywords, canonical www, OG, Twitter) + ToolLayout + **conteúdo rico único** + `<Client/>`
- `[Nome]Client.tsx`: UI + `trackToolUsed` na **primeira interação real** (nunca no mount; pré-preenchidas = quando estado ≠ default)
- 6 FAQs + 4 related da mesma categoria + howItWorks terminando em **Your privacy** (verdadeiro)
- Multi-moeda USD/EUR/GBP/BRL quando financeira; visor "—" inválido
- Conversores dedicados: UI pré-configurada + conteúdo próprio (NÃO doorway)

### 5.2 Todo jogo
1. Visual premium igual à capa 2. Sons Web Audio (classe local + 🔊/🔇) 3. Teclado + touch (nunca só teclado) 4. Dificuldade real sem teto baixo 5. sessionStorage quando fizer sentido 6. **Testar lógica ANTES** (Node + esbuild bundle) 7. Sem re-render 60fps 8. Sem pixel art manual
9. **NOVO (do Sudoku):** engine de jogo pura em `src/lib/<jogo>.ts` (sem DOM) → testável em Node; gerador com verificação matemática (sudoku: solução única via countSolutions)

### 5.3 Todo guia
- `content/guides/<slug>.md`: frontmatter (title, slug, date, updated, description, tools:[slugs]) + markdown com tabelas
- ~900-1.200 palavras, tabelas reais, links cruzados guia↔tool, honestidade técnica
- Pipeline automático: índice + página + sitemap + teaser home + CTAs — **novo guia = criar .md + push, mais nada**

---

## 6. 📚 CONTEÚDO EXISTENTE

### 6.1 Guias (11)
png-vs-webp · what-is-heic · compress-pdf-guide · social-media-image-sizes · how-to-email-large-pdf · strong-passphrases · heic-vs-jpg-iphone · how-to-merge-pdf-files · jpg-vs-png · how-to-unlock-pdf · lossy-vs-lossless

### 6.2 Tier-1 aprofundadas (conteúdo único): 19/20 (json-formatter é o modelo original)
Blocos: pdf-merge (pro tips) · pdf-compress (tabela de redução por tipo + link guia) · word-counter (tabela de limites) · qr-code (error correction + escaneabilidade) · password-generator (length beats complexity) · pdf-split · images-to-pdf · text-case · text-diff · uuid · base64 · jwt · image-compressor · jpg-png-webp · favicon · compound-interest ($100/mês 10/20/30 anos) · discount (stacked≠summed) · token-counter · ai-cost-calculator

---

## 7. ✅ CATÁLOGO COMPLETO (130 — tools.ts do GitHub, 04/09)

**Finance (9):** percentage-calculator · loan-calculator · discount-calculator · tip-calculator · salary-calculator · compound-interest · vat-calculator · mortgage-calculator · fuel-economy-calculator
**Health & Fitness (5):** bmi-calculator · age-calculator · pregnancy-due-date · calorie-calculator · ideal-weight
**Math & Education (8):** fraction-calculator · gpa-calculator · percentage-change · ratio-calculator · geometry-calculator · scientific-calculator · statistics-calculator · aspect-ratio-calculator
**Converters (9):** unit-converter · temperature-converter · timezone-converter · number-base-converter · roman-numeral-converter · currency-converter · shoe-size-converter · length-converter · weight-converter
**Date & Time (6):** date-calculator · countdown-timer · work-days-calculator · unix-timestamp · days-until-date · stopwatch
**Text Tools (15):** word-counter · text-case-converter · lorem-ipsum-generator · text-diff · slug-generator · readability-checker · keyword-density · fancy-text-generator · emoji-copy-paste · hashtag-generator · morse-code · text-encryptor · number-to-words · text-to-speech · typing-test
**Developer Tools (20):** json-formatter · base64-encoder · url-encoder · uuid-generator · hash-generator · password-strength · regex-tester · jwt-decoder · csv-json-converter · fake-data-generator · url-shortener · cron-generator · markdown-to-html · css-gradient-generator · px-to-rem · meta-tag-generator · xml-formatter · yaml-formatter · sql-formatter · json-to-yaml
**Generators & Fun (12):** password-generator · random-number-generator · qr-code-generator · color-palette · dice-roller · wheel-spinner · giveaway-picker (bloco PT + 3 FAQs PT — exceção SEO) · love-calculator · coin-flip · username-generator · random-word-generator · pet-business-name-generator
**Image Tools (10):** image-compressor · jpg-png-webp-converter · image-to-base64 · favicon-generator · image-cropper · image-resizer · heic-to-jpg · webp-to-jpg · png-to-webp · exif-viewer (EXIF Viewer & Remover)
**PDF Tools (15):** pdf-merge · pdf-split · images-to-pdf · pdf-protect · pdf-rotate · pdf-sign · pdf-unlock · pdf-compress · pdf-watermark · pdf-reorder · pdf-number-pages · pdf-metadata · pdf-to-images · pdf-repair · pdf-remove-pages
**AI Tools (7):** prompt-generator · token-counter · ai-cost-calculator · ai-coding-tools · free-ai-directory · llm-model-comparison · system-prompt-builder
**Games (14):** snake · 2048 · memory-match · snake-puzzle · noughts-crosses · sequence-memory · minesweeper · block-stacker · dino-run · word-guess · pixel-pong · brick-breaker · four-in-a-row · **sudoku** (novo 01/09: 4 dificuldades, gerador solução única, notas, 3 dicas, undo, timer, sessão, GA4 game_won)

**Totais: 130 tools (116 ferramentas + 14 jogos) · hub /tools · /guides com 11 · 162 URLs (162 no sitemap)**

**percentage-calculator:** convertida ao padrão (server+Client) em 20/08 — a exceção "inline" ACABOU.

---

## 8. 🐛 LIÇÕES APRENDIDAS (ACUMULADO — NUNCA REPETIR)

### Originais (V9, 1–18 — resumo)
1. tools.ts sempre inteiro (nunca insert cirúrgico) 2. pdf.js import dinâmico + `new URL(...,import.meta.url)` 3. setKeywords = array 4. PDF Protect = @cantoo/pdf-lib + self-check 5. detectar `/Encrypt` no merge 6. funções draw nível de módulo 7. sem Math.random em estado inicial (hydration) 8. Block Stacker flag silent + MiniPreview módulo 9. IA setTimeout+refs 10. minimax sem negar resultado 11. Word Guess 736 palavras 5 letras 12. Four in a Row vencer→bloquear→minimax 13. Snake Puzzle DFS solver (**PENDÊNCIA viva: teto 16–18 cobras + tabuleiro maior quando pedido**) 14. draw puro 15. jszip generateAsync blob + page-001.pdf 16. Blob cast BlobPart 17. zip: baixar de novo + VS Code fechado + conferir push 18. Morse: Web Audio em SEGUNDOS, ctx.close(), buffer único, hardStop ANTES de ensure, try/catch

### V10 (20/08)
- **L19 validação com BUILD REAL:** `next build` valida TIPOS (stubs escondem erros). Todo pacote: clone + `npm ci && npm run build` + render (`next start` + curl).
- **L20 Next 16 titles:** `{default}` sem template = erro de tipo; sem template → string simples.
- **L21 títulos auditados** (133 dup + 12 "Tools Tools" corrigidos).
- **L22 React 19 scripts:** script cru em Server = warning hidratação; scripts globais = client + injeção DOM; next/script beforeInteractive vira payload RSC.
- **L23 GA4 stub OFICIAL:** `function gtag(){dataLayer.push(arguments)}` — rest-args são IGNORADOS (bug real, zero collect). Teste: Realtime + collect 204 + get client_id.
- **L24 pageviews sanitizados** (send_page_view:false + manual com /search limpo).
- **L25 privacidade honesta:** sem afirmação absoluta; externos reais = cleanuri + frankfurter (§6 da privacy).
- **L26 FAQ schema = semântica** (sem rich snippet desde 2023).
- **L27 sitemap é a indexação em massa** (sem 10 pedidos/dia).

### V11 (24–31/08)
- **L26b contraste AA:** ink/30–60 em texto pequeno FALHA (4,28:1). Padrão: ≥ink/70; accent-deep/soft; underline sempre. Aplicado em TUDO (layout, home, header, footer, hub, ToolLayout ×130, 89 Clients, institucionais, guias, not-found).
- **L28 2 contas GitHub:** 403 "denied to revistacasa" = Gerenciador de Credenciais Windows guardou conta errada → remover `git:https://github.com` → push → logar multitool-com.
- **L28b** avisos LF→CRLF = inofensivos.
- **L29 performance:** hero 2MB→191KB+webp (−91%); fontes @import→next/font; cache immutable p/ hero/games/images (next.config headers); picture+webp+fetchPriority+dimensões; capas 768px (−47%).
- **L29b TBT timing do gtag:** requestIdleCallback sozinho jogou 161KB DENTRO da janela FCP→TTI (desktop 100→80, TBT 450ms). **Fix: piso 3s → depois idle.** TBT só conta entre FCP e TTI.
- **L30 diagnóstico sem Lighthouse local:** links PSI não abrem p/ IA; API anônima estoura cota; Chrome headless sem root falha. **Método: curl estático + relatórios colados pelo usuário.**
- **L31** teste PSI novo após cada pacote; aquecer CDN (anônima) antes.
- **L32** GA4 títulos antigos = histórico, não bug.

### V12 (01–04/09)
- **L33 sudoku/engine pura:** lógica de jogo em `src/lib/*.ts` sem DOM → bateria Node via esbuild bundle ANTES de escrever a UI. Bicho encontrado: grade com dados contraditórios explodía o solver (pré-checar duplicatas ANTES de buscar — retorno instantâneo).
- **L34 primeiro contato AdSense (procedimento completo):** conta YouTube limitada ("AdSense para YouTube") → upgrade via **janela anônima + `adsense.google.com/start` ANTES do login** (logado, cai na tela limitada). pub-ID em Conta→Configurações→Informações da conta. pub-… (conta) = ca-pub-… (site). Script async no layout + ads.txt. Conta antiga em bom standing = OK. E-mail da conta ≠ e-mail do projeto (não importa). **NUNCA clicar nos próprios anúncios** (conta compartilhada com o YouTube!). CMP do Google (2 botões) escolhida na inscrição.

---

## 9. ⚡ PERFORMANCE E SEO (ESTADO ATUAL)

**PageSpeed (25/08):** Desktop **100/100/100/100** · Mobile **96/100/100/100** (FCP 0,9s · LCP 2,8s · TBT 30ms · CLS 0)
Sobras "fora da pontuação": gtag 161KB (inerente), JS não usado 29KB + polyfills 14KB (chunk Next), CSS 14,6KB — não perseguir sem sinal.
**Indexação (SC, até 20/08):** 54 indexadas · ~100 "detectada-não-indexada" (fila normal) · impressões 22→205/dia. **Sudoku: pedir indexação quando lembrar.**
**GA4 (agosto):** 73 usuários (maioria dono+bots de datacenter: Council Bluffs/Ashburn/Boardman) · orgânicos reais: Google 3 + Bing 1 + FB 1 · engajamento 3min29s · EUA #1 (46%) · topo: **PDF Tools (132) · Games (62) · AI (35) · Morse (13) · Currency (12)** · guias ~7 views.

---

## 10. 🔧 ARQUITETURA GA4/ADSENSE ATUAL (NÃO MEXER SEM MOTIVO)

**PageViewSanitizer (client):** cria dataLayer + **stub oficial** gtag(arguments) → `config` com `send_page_view:false` → injeta gtag.js via DOM com **piso de 3s + requestIdleCallback** → envia 1 page_view por rota com URL sanitizada (`/search` sem `?q=`). Eventos `tool_used/tool_copy/tool_download/game_won` via `src/lib/analytics.ts` — **somente literais** (auditado).
**AdSense (layout.tsx):** `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9130344238396108" crossOrigin="anonymous">` no fim do body + `public/ads.txt`. **CMP do Google ativa banners EEE/UK/CH automaticamente** (nenhum código extra). Personalização: AdSense → Privacidade e mensagens.

---

## 11. 📈 DADOS & ESTRATÉGIA

**Estratégia ativa (acordada com a outra LLM):** congelamento de QUANTIDADE de tools (valor/conteúdo liberado) + observar SC/GA4 + expandir por sinal (query com impressões e sem página → página exata). Classificação: A expandir · B melhorar · C manter · D parar.
**Cruzamento com outra LLM:** contínuo desde 20/08 (4 rodadas aplicadas; próxima análise relevante = dados reais SC).

### ⏳ FILA (ordem)
1. **PÓS-APROVAÇÃO ADSENSE:** personalizar CMP (cores/idioma) → decidir Auto Ads vs blocos manuais → posicionamento (150px dos jogos; longe de botões de ação) → monitorar RPM/países
2. **Manuais do usuário (pendentes):** filtro de tráfego interno GA4 (Curitiba por IP) + desativar "Pesquisa no site" (medição melhorada)
3. **AdSense Revenue Calculator** (1ª tool pós-congelamento; EN; Finance; pageviews×CTR×CPC/RPM + presets nicho + multi-moeda + disclaimers)
4. Backlog por sinal: conversores individuais restantes (jpg-to-png etc.) · minifiers · SEO/Web tools · math (quadratic, LCM, GCF…) · finance (ROI, markup, invoice…) · Snake Puzzle 16–18 cobras · "Popular this week" (GA4) · i18n vencedoras
5. Guias: +lote quando dados mostrarem demanda (backlog: JPEG artifacts · PDF/A · OCR · Core Web Vitals…)
6. **Remover badges NEW** do hub após algumas semanas

---

## 12. 💬 COMUNICAÇÃO COM O USUÁRIO

- Iniciante: 1 comando por mensagem quando cansado; erros explicados com calma; **pedir para COLAR TEXTO** (nem toda IA lê prints); sem opções A/B
- **LOTES ÚNICOS por tema** (pedido expresso 24/08)
- Publicação: jeito B; avisar zip novo + VS Code fechado; npm install se deps mudaram; 403 → L28
- Verificação pós-publicação SEMPRE: commit + deploy status (API) + curl das páginas novas ao vivo

## 13. ⚠️ REGRAS (CONSOLIDADAS)

1. Sem A/B 2. tools.ts completo 3. Não recriar READY 4. percentage = padrão 5. Não religar PWA install 6. Não remover TXT SC 7. EN (exceto Giveaway PT) 8. 6 FAQs + 4 related 9. Avisar limite de chat 10. Jogos: capa+som+touch+dificuldade+testes 11. Comandos jeito B 12. Congelamento de QUANTIDADE (exceção: pedido explícito + sinal de dados) 13. GA4: stub oficial + literais + sanitização + piso 3s 14. Privacidade: nunca afirmação absoluta 15. Fontes: sempre next/font 16. Contraste AA em tudo novo 17. Guias = .md + push 18. **AdSense: nunca clicar nos próprios anúncios; não mexer no pub-ID/ads.txt durante revisões**

## 14. 🧾 CHECKLIST DE NOVO LOTE

- [ ] Tool: page+Client padrão + GA4 1ª interação + tools.ts completo
- [ ] Jogo: engine pura em lib/ + bateria Node + UI capa/som/touch/dificuldade
- [ ] Guia: .md frontmatter + tabelas + CTAs automáticos
- [ ] **Testes de lógica + build real + render** (L19) — sempre
- [ ] Zip ÚNICO por tema; npm install se deps; avisar download de novo + VS Code
- [ ] Publish jeito B → deploy SUCCESS → verificar ao vivo → pedir reteste se perf

---

## 15. 📍 ONDE PARAMOS (04/09/2026, ~15h)

- **ADSENSE ENVIADO PARA REVISÃO** ✅ (3 checks verdes: propriedade verificada + revisão solicitada + CMP do Google 2 botões). Status "Preparando". E-mail chegará na conta. Se reprovar → trazer o texto do motivo que corrigimos e reaplicamos.
- Sudoku publicado e verificado (01/09)
- Performance 100/96 · 130 tools · 11 guias · 162 URLs
- **Próxima sessão provável:** (a) e-mail de aprovação → configurar anúncios/CMP/posicionamento; ou (b) enquanto espera: fila acima (manuais GA4, calculator, guias por sinal)

## 16. 🗂️ HISTÓRICO RESUMIDO DO PROJETO (linha do tempo)

- **~12/08/2026:** domínio registrado; projeto Next começou (V7 do prompt falava "40+ tools")
- **19/08:** mega-lote 37 tools → 117 tools + 13 jogos · Morse corrigido · lição build TS
- **20/08:** dia das correções SEO (6 pacotes: canonical www, títulos, YMYL, GA4 events, privacidade honesta, sanitização /search) + **lote 5: +12 tools + hub /tools → 129** · GA4 stub oficial corrigido ao vivo
- **24/08:** value pack 1 (/guides + 3 guias + 5 Tier-1 + teaser home) · value pack 2 (+4 guias, 14 Tier-1) · perf pack (hero −91%, next/font, cache)
- **25/08:** pagespeed pack (capas −47%, contraste AA rodada 1, gtag deferral) → **regressão desktop 80** → pack 2 (piso 3s) → **100/96** ✅
- **31/08:** guides pack 3 (+4 guias → 11; contraste AA site-wide: ToolLayout + 89 clients + institucionais) · push 403 resolvido (L28) · análises SC + GA4
- **01/09:** **Sudoku** (engine pura testada, 4 dificuldades, solução única) → 130 tools
- **04/09:** **AdSense: pacote (script + ads.txt) + inscrição + CMP → site EM REVISÃO**

*Fim do PROMPT-MASTER v12 — edição panorama completo (backup externo). Gerado por Arena.ai Agent Mode em 04/09/2026.*
