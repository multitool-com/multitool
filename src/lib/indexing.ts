/**
 * Triagem de indexação — fonte única da verdade sobre o que o Google pode indexar.
 *
 * Contexto (auditoria de 15/10/2026): o site foi reprovado no AdSense por
 * "conteúdo de baixo valor". A varredura completa mostrou que 145 páginas de
 * ferramenta tinham, em mediana, ~390 palavras de conteúdo próprio — muito abaixo
 * do que sustenta "valor único substancial" — enquanto o site expunha todas as
 * 182 URLs no sitemap de uma vez. Isso caracteriza volume alto com pouco valor por
 * página (política de "abuso de conteúdo em escala" e "conteúdo superficial").
 *
 * Estratégia: em vez de aparecer com 182 páginas finas, o site passa a indexar
 * apenas as páginas que passam no critério de qualidade. As demais continuam
 * funcionando normalmente para quem chega por link interno ou pela busca do site
 * (robots: noindex, follow — o "follow" mantém o fluxo de links para as boas),
 * e voltam ao índice conforme são aprofundadas, uma a uma.
 *
 * CRITÉRIO PARA UMA PÁGINA SER INDEXÁVEL
 *   1. ≥ 500 palavras de conteúdo próprio medidas fora de menu/rodapé
 *      (o que já está no arquivo `fila-de-trabalho.csv` da auditoria);
 *   2. conteúdo escrito à mão, não gerado em massa;
 *   3. sem texto desatualizado ou afirmação não verificada.
 *
 * COMO DEVOLVER UMA PÁGINA AO ÍNDICE
 *   Aprofunde a página até passar no critério e mova o slug para a lista
 *   `INDEXABLE_TOOL_SLUGS` (ou `INDEXABLE_CATEGORY_SLUGS`). Rode a auditoria de
 *   novo (`auditoria/crawl.py`) para confirmar a contagem antes de mover.
 *
 * IMPORTANTE: se o Search Console mostrar alguma página desta lista de noindex
 * recebendo cliques reais, mova o slug para a lista de indexáveis — tráfego real
 * pesa mais que a estimativa de palavras.
 */

/** Ferramentas medidas com ≥ 500 palavras de conteúdo próprio (auditoria 15/10/2026). */
export const INDEXABLE_TOOL_SLUGS: readonly string[] = [
  // PDF / documentos
  "pdf-to-markdown",
  "word-to-pdf",
  "markdown-integrity-check",
  "pdf-merge",
  "pdf-compress",
  "pdf-split",
  // IA
  "free-ai-directory",
  "ai-coding-tools",
  "llm-model-comparison",
  "token-counter",
  "ai-cost-calculator",
  "prompt-generator",
  "system-prompt-builder",
  // Financeiro
  "loan-calculator",
  "tip-calculator",
  "discount-calculator",
  "currency-converter",
  // Texto / dev
  "word-counter",
  "readability-checker",
  "jwt-decoder",
  "csv-json-converter",
  "json-formatter",
  // Imagem
  "image-compressor",
  // Conversores / unidades
  "unit-converter",
  "temperature-converter",
  "shoe-size-converter",
  // Saúde / data
  "bmi-calculator",
  "age-calculator",
  // Geradores / jogos
  "qr-code-generator",
  "password-generator",
  "giveaway-picker",
  "sudoku",
];

/**
 * Categorias indexáveis.
 *
 * Vazio de propósito: na auditoria, a categoria com mais conteúdo próprio tinha
 * 448 palavras — abaixo do critério (600) e exatamente o perfil de "página de
 * listagem criada para ranquear" que a política de doorways descreve. Cada
 * categoria volta ao índice quando ganhar conteúdo editorial próprio.
 */
export const INDEXABLE_CATEGORY_SLUGS: readonly string[] = [];

const TOOL_SET = new Set(INDEXABLE_TOOL_SLUGS);
const CATEGORY_SET = new Set(INDEXABLE_CATEGORY_SLUGS);

/**
 * Diretiva de robots para uma página de ferramenta.
 * `noindex, follow`: fora do índice, mas os links internos continuam contando.
 */
export function toolRobots(slug: string) {
  const indexable = TOOL_SET.has(slug);
  return {
    index: indexable,
    follow: true,
    googleBot: { index: indexable, follow: true },
  };
}

/** Diretiva de robots para uma página de categoria. */
export function categoryRobots(slug: string) {
  const indexable = CATEGORY_SET.has(slug);
  return {
    index: indexable,
    follow: true,
    googleBot: { index: indexable, follow: true },
  };
}

/** Páginas que devem entrar no sitemap (mesma regra da indexação). */
export function isToolIndexable(slug: string): boolean {
  return TOOL_SET.has(slug);
}

export function isCategoryIndexable(slug: string): boolean {
  return CATEGORY_SET.has(slug);
}

/** Resumo para o painel/log: quantas páginas estão expostas ao Google hoje. */
export function indexingSummary() {
  return {
    ferramentasIndexaveis: TOOL_SET.size,
    ferramentasForaDoIndice: `ver fila-de-trabalho.csv (auditoria)`,
    categoriasIndexaveis: CATEGORY_SET.size,
  };
}
