"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Envia page_view manuais com URL sanitizada.
 *
 * O gtag config no layout usa send_page_view: false, o que desliga o
 * page_view automatico do GA4 (incluindo o rastreamento SPA via history).
 * Este componente assume o controle: 1 page_view por rota, sempre com
 * page_location limpo — em /search o parametro ?q= NUNCA e enviado ao GA4,
 * enquanto o usuario continua vendo a URL original na barra de endereco.
 */
export default function PageViewSanitizer() {
  const pathname = usePathname();

  useEffect(() => {
    const loc = window.location;
    const cleanLocation =
      loc.pathname === "/search" ? `${loc.origin}/search` : loc.href;

    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };
    const params = { page_location: cleanLocation };

    if (typeof w.gtag === "function") {
      w.gtag("event", "page_view", params);
    } else {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(["event", "page_view", params]);
    }
  }, [pathname]);

  return null;
}
