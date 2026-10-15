# Auditoria AdSense — multitoolbox.online
**2ª reprovação ("Conteúdo de baixo valor") · diagnóstico com números reais · 15/10/2026**

---

## 1. Veredito em uma página

O site **não foi reprovado por um erro específico** — não há página ilegal, conteúdo copiado,
link enganoso ou problema técnico. A varredura completa confirma isso. O que o revisor vê é
**outra coisa**: um site com **182 URLs indexáveis** em que **145 páginas de ferramenta seguem
exatamente o mesmo molde, com ~400 palavras cada, sem uma única imagem no conteúdo, sem autor,
sem data de atualização e sem nenhum sinal externo de que alguém usa o site**.

O texto do Google é literal quanto ao que ele mede nesta reprovação:

> "sites precisam oferecer um **valor único substancial**, estabelecer uma
> **presença consistente na web** e mostrar um **nível de interesse do usuário** que apoie uma
> parceria de publicidade comercial."

Traduzindo para o que existe hoje:

| O que o Google pede | O que o site tem hoje | Situação |
|---|---|---|
| Valor único substancial | ~392 palavras únicas por ferramenta, 0 imagem no corpo | ❌ |
| Presença consistente na web | site não aparece nem na busca pelo próprio nome | ❌ |
| Interesse genuíno do usuário | sem tráfego orgânico detectável, sem backlinks, sem marca | ❌ |
| Curadoria e manutenção contínuas | sem autor, sem data, sem changelog | ❌ |
| Conteúdo não duplicado | cada ferramenta tem texto próprio (10% de fórmula) | ✅ |
| Ferramentas autênticas e funcionais | as ferramentas realmente funcionam | ✅ |
| Requisitos técnicos (HTTP, SSL, ads.txt, rastreadores) | tudo certo | ✅ |

**A reprovação não foi causada por algo quebrado. Foi causada por escala de conteúdo fino.**
É importante entender a diferença, porque as correções são de natureza diferente: não é
"consertar", é **reduzir a superfície e aumentar a profundidade**.

---

## 2. Como esta auditoria foi feita (reprodutível)

1. Build local do site **idêntico ao publicado** e crawl das **182 URLs do `sitemap.xml`**.
2. Para cada página: extração do texto **fora de header/footer** (para não contar menu e rodapé),
   contagem de palavras, títulos H2, links internos, imagens no corpo e **shingles** (n-gramas)
   de 5 e 8 palavras para medir repetição.
3. Verificação de **status HTTP** de cada URL, `robots.txt`, `ads.txt`, canonical e `noindex`.
4. Comparação linha por linha com os documentos que o próprio Google citou na reprovação
   (políticas de conteúdo AdSense, conteúdo superficial, políticas de spam da Pesquisa).
5. Checagem externa: presença do domínio na busca pelo próprio nome.

Arquivos gerados (ficam na pasta `auditoria/`):

| Arquivo | Conteúdo |
|---|---|
| `fila-de-trabalho.csv` | **as 182 páginas com prioridade e ação sugerida** — é a lista de trabalho |
| `auditoria-paginas.csv` | métricas por página (palavras, únicas, H2, links, imagens, title) |
| `auditoria-detalhada.json` | dados completos + assinaturas de estrutura por página |
| `auditoria-por-tipo.txt` | resumo por tipo de página |
| `crawl.py` / `analise.py` | os scripts, para rodar de novo depois das mudanças |

---

## 3. Os números do site

| Tipo de página | Qtde | Palavras (mediana) | Palavras únicas (5-gramas) | Texto de fórmula |
|---|---|---|---|---|
| Ferramenta | **145** | 436 (mín 309, máx 1088) | **392** | 10% |
| Guia | 15 | 627 (mín 568) | 524 | 15% |
| Categoria | 12 | **312** (mín 180) | **266** | 16% |
| Institucional | 9 | 543 | 527 | 6% |
| Hub `/tools` | 1 | 3010 | 2291 | 24% |
| **Home** | 1 | **390** | 290 | — |

Achados que importam para o revisor:

- **145 páginas de ferramenta com ZERO imagem no conteúdo.** Nenhuma. O preview animado existe
  só nos cards das páginas de categoria.
- **43 links internos por página** (variação de 43 a 46) — o mesmo bloco de "Related Tools"
  replicado em todas, o que dá ao site um aspecto de grade gerada em série.
- **Estrutura idêntica:** todas têm `How it works / Your privacy / Frequently Asked Questions /
  Related Tools` (7 a 12 H2 por página, sempre os mesmos blocos).
- **Categoria mais fina:** `/tools/health` com **180 palavras** (162 únicas) — página criada para
  ranquear "free health calculators" e que não entrega quase nada de texto.
- **Home com 390 palavras** para um site que diz ter "145 ferramentas".
- **Guias com ~627 palavras** — abaixo do que se espera de um conteúdo editorial; os textos
  originais previam 900–1200 palavras.
- **Sem autor, sem byline, sem data visível** nas ferramentas. Só os guias têm data.
- **Duas páginas quase iguais:** `/tools/games/snake` e `/tools/games/snake-puzzle`.
- **Família de conversores sobrepostos:** `jpg-png-webp-converter`, `png-to-webp`, `webp-to-jpg`
  (três URLs para a mesma intenção).
- **Texto desatualizado** (ex.: `/tools/pdf-tools/pdf-merge` ainda diz que Protect/Unlock "are
  coming soon", mas as duas já existem). Não é violação, mas conta contra "curadoria e manutenção".

E o dado mais duro: **o domínio não aparece na busca pelo próprio nome.** Não há índice, não há
menções, não há tráfego orgânico que sustente "interesse genuíno do usuário".

---

## 4. Política por política: o que foi (e o que não foi) violado

### 4.1 ❌ VIOLADO — "Conteúdo de baixo valor" / conteúdo exclusivo insuficiente
*fonte: `support.google.com/adsense/answer/10015918`*

O Google pede "conteúdo exclusivo suficiente para determinarmos qual é o assunto principal" e
diz explicitamente:

> "Se você tiver **muitas páginas semelhantes ou com conteúdo muito parecido**, considere incluir
> materiais diferentes em cada página ou **consolidá-las em uma só**. Além disso, tente minimizar
> a repetição de textos longos em várias páginas."

**Evidência:** 145 páginas com ~392 palavras únicas, mesma estrutura, mesmo bloco de links,
nenhuma imagem. É exatamente o cenário descrito — e agravado pelo volume.

### 4.2 ⚠️ RISCO ALTO — "Abuso de conteúdo em escala"
*fonte: `developers.google.com/search/docs/essentials/spam-policies`*

> "Abuso de conteúdo em escala ocorre quando **muitas páginas são geradas** com o objetivo
> principal de manipular as classificações da pesquisa, e não ajudar os usuários. (...) grandes
> volumes de conteúdo não original que oferece **pouco ou nenhum valor**."

**Evidência:** o site passou de poucas para **145 páginas de ferramenta** em ondas (lotes de 10–37),
todas produzidas a partir do mesmo esquema. Não importa que cada página tenha um texto próprio:
o **padrão de produção em escala com baixo valor por unidade** é o que a política descreve.
Esse é o item mais perigoso da lista, porque afeta também o **Search** (não só o AdSense).

### 4.3 ❌ VIOLADO — Conteúdo superficial (thin content)
*fonte: `support.google.com/webmasters/answer/9044175#thin-content`*

**Evidência:** 12 páginas de categoria (medianas de 312 palavras, mínima de 180) e a home com 390
palavras. São páginas de listagem com pouco texto próprio — o clássico "pouco ou nenhum valor
agregado" em página feita para ranquear.

### 4.4 ⚠️ RISCO MODERADO — Abuso de doorways
*fonte: mesma página de spam policies*

> "Ter várias páginas (...) para maximizar o alcance em qualquer consulta específica" e
> "criar páginas consideravelmente semelhantes e mais próximas aos resultados de pesquisa do que,
> por exemplo, uma hierarquia claramente definida e navegável."

**Evidência:** 12 páginas de categoria construídas com título de SEO ("Free Health Calculators...")
e frases de intenção de busca, com 180–330 palavras cada. Não é um caso clássico de doorway, mas
o padrão se aproxima. Combinado com 4.2, é o que faz o revisor humano concluir "baixo valor".

### 4.5 ✅ NÃO violado — Conteúdo duplicado / raspagem
Medido: apenas ~10% do texto das ferramentas se repete em 3+ páginas (5-gramas), e só **1 frase**
aparece repetida em 5 ou mais páginas. **Não é um problema de cópia** — é de escassez.

### 4.6 ✅ NÃO violado — Funcionalidade enganosa
As ferramentas funcionam de verdade (PDF, conversores, jogos, Word→PDF etc.). Nada de "gerador
falso". Único ajuste: corrigir frases desatualizadas ("coming soon" para ferramentas que já existem).

### 4.7 ✅ NÃO violado — Conteúdo ilegal, perigoso, enganoso, IP, privacidade
Nada encontrado na varredura. Políticas, termos, cookies, disclaimer e ads.txt presentes.

### 4.8 ✅ Técnico — tudo certo (importante: não perca tempo aqui)
- 182/182 URLs em **HTTP 200**; HTTPS válido; sem `noindex` indevido.
- `robots.txt` libera `Mediapartners-Google` e `AdsBot-Google`; `ads.txt` **autorizado**.
- Fragmento do AdSense presente no `<head>`; o item "verifique a propriedade do site" **está
  resolvido** (o painel mostra `Autorizado`). Não é ele o bloqueio.

---

## 5. Por que sites "mais simples, com menos ferramentas" são aprovados

Essa é a pergunta certa, e a resposta é desconfortável mas simples:

1. **Aprovação não é proporcional ao número de ferramentas.** O revisor não conta ferramentas —
   ele avalia se o site parece feito por alguém com um propósito, com conteúdo que não existe
   em outro lugar. **Cada página fina extra piora a média, não melhora.**
2. **Site pequeno e focado passa porque é profundo no que faz.** Um site com 8 ferramentas de
   PDF, cada uma com 1.500 palavras de conteúdo original, exemplos, tabelas e imagem, passa.
   Um com 145 ferramentas de 400 palavras, não.
3. **Histórico e tráfego contam.** A grande maioria dos sites que você vê monetizados foi
   aprovada anos atrás (critério mais frouxo) ou tem tráfego real e backlinks. Sua conta e seu
   domínio são novos: o Google exige "presença consistente na web" — isso se constrói com tempo
   e uso, não com quantidade de páginas.
4. **O que o revisor vê em 30 segundos:** home → categoria → uma ferramenta. Se as três parecerem
   um template com texto genérico, ele reprova — mesmo que a ferramenta funcione.

Conclusão prática: **menos páginas, mais profundas, com identidade editorial e tempo de casa.**

---

## 6. Plano de correção — 4 lotes

### Lote 0 — Higiene (1 dia de trabalho, efeito imediato na percepção)
- Consolidar duplicatas: manter **um** jogo de snake; fundir os três conversores de imagem em
  um só (`jpg-png-webp-converter` com âncoras) e redirecionar (301) as URLs antigas.
- Corrigir textos desatualizados ("coming soon" de ferramentas que existem) em todas as páginas.
- Adicionar **data de última atualização** visível em ferramenta e guia.
- Reescrever a home: de 390 para **900+ palavras** explicando o que o site é, para quem, com
  critério editorial (não lista de cards).

### Lote 1 — Triagem de indexação (a mudança estrutural mais importante)
O objetivo é deixar de expor 182 páginas finas e passar a expor as que sustentam valor.

1. Aplicar **`noindex, follow`** em todas as ferramentas ainda não aprofundadas (continuam
   acessíveis por link interno e pela busca do site, mas saem do índice do Google).
2. **Reduzir o `sitemap.xml`** às páginas que passam no critério de qualidade (abaixo).
3. Aprofundar em **lotes de 10–15 páginas por semana**, removendo o `noindex` conforme a página
   passa no critério.
4. Categorias: manter indexadas **só as que tiverem 600+ palavras** de texto próprio. As outras
   viram `noindex` até serem aprofundadas (ou são fundidas).

**Critério de qualidade para uma página voltar ao índice** (mensurável — já está no
`fila-de-trabalho.csv`):

- ≥ **700 palavras de conteúdo próprio** (fora de menu, rodapé e FAQ genérica);
- ≥ **1 imagem própria** (print da ferramenta com resultado real, ou gráfico/tabela gerada);
- **1 exemplo resolvido com números reais** (não um exemplo "abstrato");
- **1 tabela de referência** útil (faixas, limites, comparações);
- **seção "quando não usar / limitações"** — honestidade é sinal de qualidade;
- **byline + data de atualização**;
- **3+ links internos contextuais** no meio do texto (não só o bloco de relacionados).

### Lote 2 — Valor único de verdade (o que destrava a aprovação)
- Aprofundar primeiro as **20 ferramentas com intenção comercial** (PDF, imagem, financeiro, IA):
  são as que trazem tráfego de busca e onde há espaço para conteúdo original.
- **Dados originais de primeira mão** — o diferencial mais forte disponível: rodar medições
  reais e publicar método + números. Exemplos que o próprio site já sabe fazer:
  - "Testamos a compressão de 30 imagens/20 PDFs reais: quanto cada tipo perde" (tabela + método);
  - "Recortei 15 PDFs de scanners diferentes: o que o crop por porcentagem realmente remove";
  - "Convertemos 12 .docx reais para PDF: o que sobrevive e o que se perde" (tabela por recurso).
  Isso é conteúdo que **não existe em nenhum outro lugar**, é reproduzível e vira link natural.
- Guias: subir os 15 para **1.500–2.500 palavras**, com dados próprios e byline; transformar 3–4
  em "pilares" que puxam para as ferramentas.
- Reduzir o catálogo visível na home para **os destaques + categorias**, em vez de "145 ferramentas".

### Lote 3 — Identidade editorial (E-E-A-T)
- Página **/about** com quem escreve (nome, foto, bio curta, contato) — hoje são 543 palavras
  sem rosto. Alternativa aceitável: "equipe" com responsável nomeado.
- **/editorial-policy** (como os conteúdos são produzidos, revisados e atualizados).
- **/how-we-test** (metodologia das medições publicadas).
- **/updates** (changelog datado) — sinal barato e honesto de manutenção contínua.
- Byline + data em guias e nas páginas aprofundadas.

### Lote 4 — Presença externa e histórico (o que não se compra, se constrói)
- Search Console: conferir indexação, corrigir o que aparecer; enviar o sitemap reduzido.
- Divulgação honesta, onde for útil: diretórios de ferramentas, comunidades técnicas
  (respostas reais com link apenas quando responde a pergunta), Product Hunt, GitHub, Reddit.
- Tráfego: publicar os guias/pesquisas, conseguir as primeiras menções, acompanhar no GA4.
- **Não reaplicar antes de 4–6 semanas** de site ativo com as mudanças publicadas.

---

## 7. Cronograma realista

| Semana | Foco | Meta verificável |
|---|---|---|
| 1 | Lote 0 + Lote 1 (triagem e sitemap) | sitemap com ≤ 40 URLs; duplicatas fundidas |
| 2–3 | Aprofundar 20–25 ferramentas prioritárias | cada uma passando no critério de qualidade |
| 3–4 | Guias: 8 reescritos + 2 pesquisas com dados originais | 1.500+ palavras cada; byline |
| 5 | Lote 3 (identidade editorial) + home reescrita | /about com autor; /updates no ar |
| 6 | Lote 4 (divulgação, indexação, tráfego) | primeiras impressões no Search Console |
| 7–8 | Continuar aprofundando 15/semana | 60+ páginas fortes indexadas |
| 9 | Reavaliar e **só então reaplicar** | site com sinais de uso real |

**Esforço estimado:** ~40–60 h de trabalho distribuídas em 6–8 semanas. Não há atalho: qualquer
tentativa de "gerar conteúdo em massa" é exatamente o que a política de abuso em escala pune e
pode custar a conta.

---

## 8. O que NÃO fazer

| ❌ Não faça | Por quê |
|---|---|
| Gerar texto em massa com IA para as 145 páginas | é a definição de "abuso de conteúdo em escala" — pode afetar a conta e o índice |
| Comprar backlinks ou trocar links em massa | política de spam por links |
| Reaplicar a cada semana | duas reprovações já; reincidência sem mudança real piora o histórico |
| Esconder conteúdo atrás de "leia mais" só para o rastreador, ou mostrar coisa diferente ao bot | cloaking |
| Adicionar mais ferramentas novas agora | aumenta a escala do problema antes de resolver a profundidade |

---

## 9. Checklist antes de reaplicar

- [ ] `sitemap.xml` contém **apenas** páginas que passam no critério de qualidade;
- [ ] ferramentas não aprofundadas estão com `noindex, follow` e continuam funcionando;
- [ ] nenhuma página duplicada (snake, conversores de imagem);
- [ ] home com 900+ palavras explicando propósito e critério editorial;
- [ ] todas as categorias indexadas com 600+ palavras próprias;
- [ ] guias com 1.500+ palavras, byline e data;
- [ ] ≥ 1 imagem própria em cada página indexada;
- [ ] `/about` com autor real, `/editorial-policy`, `/how-we-test`, `/updates` no ar;
- [ ] zero textos desatualizados ("coming soon");
- [ ] Search Console mostrando indexação das páginas novas;
- [ ] 4+ semanas de atividade contínua após as mudanças;
- [ ] anotar no pedido de revisão o que foi mudado (o Google valoriza a descrição do processo).

---

## 10. Resumo do diagnóstico

1. **Nada está quebrado.** Técnico, privacidade, ads.txt, SSL e as ferramentas estão corretos.
2. **O problema é de percepção de valor:** 145 páginas de ~400 palavras em molde único, sem
   imagem, sem autor, sem histórico e sem tráfego.
3. **A correção não é "consertar página", é mudar a proporção:** menos URLs indexadas, muito mais
   profundidade em cada uma, identidade editorial visível e presença externa construída no tempo.
4. **O ativo mais valioso que o site pode explorar agora é dado original:** medições reais feitas
   com as próprias ferramentas. Isso é o que ninguém copia e o que sustenta uma aprovação.


---

## 11. ANEXO — Lote 0 + Lote 1 executados (15/10/2026)

Aplicado e verificado no build local:

| Métrica | Antes | Depois |
|---|---|---|
| URLs no `sitemap.xml` | 182 | **57** |
| Ferramentas indexáveis | 145 | **32** |
| Categorias indexáveis | 12 | **0** (volta conforme ganharem conteúdo próprio) |
| Páginas com < 500 palavras expostas ao Google | 134 | **5** |
| Mediana de palavras do que está indexado | 388 | **596** |
| Home | 390 palavras | **912** |
| `/about` | 486 | **695** |
| `/how-we-build` | 371 | **682** |
| Data de revisão real (do Git) por ferramenta | não existia | **145 páginas** |
| Textos desatualizados | 1 | **0** |

Como foi implementado:

- **`src/lib/indexing.ts`** — fonte única da verdade: lista das ferramentas que passam no
  critério, funções `toolRobots()`/`categoryRobots()` e o critério escrito dentro do arquivo.
- **145 páginas de ferramenta e 12 de categoria** passaram a declarar `noindex, follow`
  quando estão abaixo do critério (o "follow" preserva o fluxo de links internos).
- **`sitemap.xml`** filtra pela mesma regra — o Google passa a ver 57 URLs, não 182.
- **`src/lib/contentDates.ts` + `scripts/gerar-datas.py`** — data de revisão retirada do
  histórico real do Git, regenerável com um comando.
- **Nenhuma página foi apagada** e **nenhuma duplicata foi removida**: a varredura provou
  que não há duplicação (nenhum par de páginas passa de 10% de similaridade em 5-gramas) —
  o problema era thinness + escala, não cópia. Snake/Snake Puzzle e os três conversores de
  imagem são páginas com intenções diferentes e foram mantidos.

A fila de trabalho (`fila-de-trabalho.csv`) continua sendo o roteiro dos próximos lotes:
113 páginas esperando aprofundamento para voltar ao índice.
