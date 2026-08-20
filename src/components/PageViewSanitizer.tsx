"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_ID = "G-M03VJPSYZZ";

interface GaWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

/**
 * Stub oficial do Google — EXATAMENTE o padrao documentado:
 *
 *   function gtag(){dataLayer.push(arguments);}
 *
 * IMPORTANTE (lição aprendida ao vivo): o gtag.js so processa comandos
 * empurrados como OBJETO `arguments`. Arrays comuns (ex.: rest args
 * `(...args) => dataLayer.push(args)`) sao IGNORADOS pela fila — nenhum
 * `collect` e enviado e `gtag('get', ..., 'client_id')` nao retorna.
 * Nao trocar esta funcao por arrow/rest params.
 */
function officialGtag(): void {
  // eslint-disable-next-line prefer-rest-params
  (window as unknown as GaWindow).dataLayer?.push(arguments);
}

function bootstrapGa(): void {
  const w = window as unknown as GaWindow;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== "function") {
    w.gtag = officialGtag;
  }
  // Comandos pelo stub oficial (viram `arguments` na fila)
  w.gtag?.("js", new Date());
  w.gtag?.("config", GA_ID, { send_page_view: false });
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }
}

/**
 * Page_view manual com URL sanitizada.
 * - config com send_page_view: false desliga o page_view automatico do
 *   GA4 (incluindo o rastreamento SPA via history);
 * - 1 page_view por rota, sempre com page_location limpo: em /search o
 *   parametro ?q= NUNCA chega ao GA4, enquanto o usuario continua vendo
 *   a URL original na barra de endereco.
 */
export default function PageViewSanitizer() {
  const pathname = usePathname();
  const bootedRef = useRef(false);

  // Bootstrap unica vez (declado antes => roda antes do efeito de page_view)
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    bootstrapGa();
  }, []);

  useEffect(() => {
    if (!bootedRef.current) return;
    const w = window as unknown as GaWindow;
    const loc = window.location;
    const cleanLocation =
      loc.pathname === "/search" ? `${loc.origin}/search` : loc.href;
    const g = typeof w.gtag === "function" ? w.gtag : officialGtag;
    g("event", "page_view", { page_location: cleanLocation });
  }, [pathname]);

  return null;
}
