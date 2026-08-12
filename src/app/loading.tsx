export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      {/* Visor estilo LCD (mesmo padrão do site) */}
      <div className="bg-deep rounded-2xl px-10 py-8 mb-6">
        <p className="font-mono text-xs text-paper/50 tracking-widest mb-3 text-center">
          LOADING
        </p>
        {/* Barra de progresso animada */}
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-8 bg-accent rounded-sm animate-pulse" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-8 bg-accent rounded-sm animate-pulse" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-8 bg-accent rounded-sm animate-pulse" style={{ animationDelay: "300ms" }} />
          <span className="w-2 h-8 bg-accent rounded-sm animate-pulse" style={{ animationDelay: "450ms" }} />
          <span className="w-2 h-8 bg-accent rounded-sm animate-pulse" style={{ animationDelay: "600ms" }} />
        </div>
      </div>

      <p className="font-mono text-xs tracking-widest text-ink/40">
        PLEASE WAIT...
      </p>
    </div>
  );
}