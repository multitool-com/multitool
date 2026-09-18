"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Preview animado "antes e depois" para cards de ferramenta.
 * A barrinha desliza da esquerda para a direita em loop (vai e volta),
 * revelando a versão "depois" (efeito aplicado) sobre a original.
 */
export default function ToolPreview({
  before,
  after,
  alt,
  staticText,
}: {
  before?: string;
  after?: string;
  alt: string;
  staticText?: string;
}) {
  const [pos, setPos] = useState(30);
  const dirRef = useRef(1);

  useEffect(() => {
    // animação via rAF: leve, sem re-render de layout
    let raf = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 30) {
        // ~33fps; varredura completa em ~2.4s (2x o original)
        // vai de 0% a 100% — ponta a ponta da imagem
        setPos((p) => {
          let next = p + dirRef.current * 2.6;
          if (next >= 100) {
            next = 100;
            dirRef.current = -1;
          }
          if (next <= 0) {
            next = 0;
            dirRef.current = 1;
          }
          return next;
        });
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!before && !after) {
    // fallback estático (categoria sem preview)
    return (
      <div className="w-full aspect-[16/9] bg-gradient-to-br from-deep to-[#0a2e2a] flex items-center justify-center">
        <span className="text-3xl opacity-80">{staticText ?? "🛠️"}</span>
      </div>
    );
  }

  if (!before && after) {
    // MODO ESTÁTICO: uma única imagem, sem animação (calculadoras etc.)
    return (
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt={alt}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden bg-ink/10">
      {/* camada ANTES (fundo) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={`${alt} — before`}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* camada DEPOIS, revelada pela esquerda até a posição da barra */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt={`${alt} — after`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {/* barra divisória com punho */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_6px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-ink text-xs font-bold select-none">
          ↔
        </span>
      </div>
      {/* etiquetas discretas */}
      <span className="absolute top-2 right-2 bg-ink/70 text-paper font-mono text-[9px] tracking-widest px-2 py-0.5 rounded">
        AFTER
      </span>
      <span className="absolute top-2 left-2 bg-paper/80 text-ink font-mono text-[9px] tracking-widest px-2 py-0.5 rounded">
        BEFORE
      </span>
    </div>
  );
}
