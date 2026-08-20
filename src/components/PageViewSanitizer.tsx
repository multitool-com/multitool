"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const GA_ID = "G-M03VJPSYZZ";

/**
 * GA4 com page_view sanitizado — 100% hidratação-segura.
 *
 * Em vez de <script> crus no layout (que o React 19 reclama em dev),
 * este componente faz o bootstrap do gtag via DOM no cliente:
 *
 * 1. Cria o dataLayer + função gtag (fila de comandos) — uma única vez;
 * 2. Envia o config com send_page_view: false (desliga o page_view
 *    automático do GA4, inclusive o rastreamento SPA via history);
 * 3. Injeta a lib gtag.js (async) — os comandos enfileirados são
 *    processados quando ela carrega;
 * 4. Envia 1 page_view por rota com a URL sanitizada: em /search o
 *    parâmetro ?q= NUNCA chega ao GA4, enquanto o usuário continua
 *    vendo a URL original na barra de endereço.
 */

interface GaWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

function bootstrapGa(): void {
  const w = window as unknown as GaWindow;
  w.dataLayer = w.dataLayer || [];
  if (typeof w.gtag !== "function") {
    w.gtag = function gtag(...args: unknown[]) {
      w.dataLayer?.push(args);
    };
  }
  w.dataLayer.push(["js", new Date()]);
  w.dataLayer.push(["config", GA_ID, { send_page_view: false }]);
  if (!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(s);
  }
}

export default function PageViewSanitizer() {
  const pathname = usePathname();
  const bootedRef = useRef(false);

  // Bootstrap única vez (roda antes do efeito de page_view)
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    bootstrapGa();
  }, []);

  // 1 page_view por rota, sempre com URL sanitizada
  useEffect(() => {
    if (!bootedRef.current) return;
    const w = window as unknown as GaWindow;
    const loc = window.location;
    const cleanLocation =
      loc.pathname === "/search" ? `${loc.origin}/search` : loc.href;
    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", { page_location: cleanLocation });
    } else {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(["event", "page_view", { page_location: cleanLocation }]);
    }
  }, [pathname]);

  return null;
}
