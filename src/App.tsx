import BrandWordmark from "@/components/ui/BrandWordmark";

function App() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute left-[-12%] bottom-[8%] h-[28vw] w-[28vw] rounded-full border border-white/20" />
        <div className="absolute right-[-10%] top-[18%] h-[30vw] w-[30vw] rounded-full border border-white/20" />
        <div className="absolute left-[12%] top-[52%] h-[18vw] w-[18vw] rounded-full border border-white/20" />
        <div className="absolute right-[18%] bottom-[10%] h-[20vw] w-[20vw] rounded-full border border-white/20" />
      </div>

      <div className="relative z-10 flex items-center justify-center gap-10 px-6">
        <BrandWordmark text="eduuhlann" className="max-w-[280px] md:max-w-[520px]" />
        <button
          type="button"
          className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] text-black shadow-[0_0_30px_rgba(255,255,255,0.18)] transition-transform duration-200 hover:scale-[1.02]"
        >
          <span>ACESSAR</span>
          <span aria-hidden="true" className="text-xl leading-none">↗</span>
        </button>
      </div>
    </main>
  );
}

export default App;
