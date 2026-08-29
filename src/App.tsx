import CyclingWarpText from "@/components/ui/CyclingWarpText";
import AnimatedCard from "@/components/ui/AnimatedCard";
import ClickSpark from "@/components/ui/ClickSpark";
import PillNav from "@/components/ui/PillNav";
import { TextAnimate } from "@/components/ui/text-animate";
import ParallaxDemo from "@/demos/default";
import { SplineSceneBasic } from "@/demos/spline-demo";
import favicon from "/favicon.ico";

function App() {
  return (
    <main className="w-full scroll-smooth bg-background">
      <PillNav
        logo={favicon}
        logoAlt="Logo"
        items={[
          { label: "Início", href: "#inicio" },
          { label: "Sobre", href: "#sobre" },
          { label: "Serviços", href: "#servicos" },
          { label: "Contato", href: "#contato" },
        ]}
        activeHref="#inicio"
        className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
        ease="power2.out"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#000000"
        pillTextColor="#ffffff"
        theme="dark"
      />
      <ClickSpark
        sparkColor="#fff"
        sparkSize={10}
        sparkRadius={15}
        sparkCount={8}
        duration={400}
      >
        <section id="inicio" className="scroll-mt-24">
          <ParallaxDemo />
        </section>
        <AnimatedCard direction="up" delay={0}>
          <section id="servicos" className="flex scroll-mt-24 justify-center p-6 md:p-10">
            <div className="w-full max-w-5xl">
              <SplineSceneBasic />
            </div>
          </section>
        </AnimatedCard>
        <AnimatedCard direction="up" delay={0.15}>
          <section id="sobre" className="flex scroll-mt-24 flex-col items-center justify-center gap-6 p-6 md:p-10" aria-label="Sobre mim">
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="character"
              once
              className="text-4xl font-bold text-white md:text-5xl"
            >
              SOBRE MIM
            </TextAnimate>
            <p className="max-w-lg text-center text-neutral-300">
              Desenvolvedor apaixonado por criar interfaces modernas, limpas e
              focadas na experiência do usuário.
            </p>
            <CyclingWarpText
              texts={['DESENVOLVEDOR FRONTEND', 'UI/UX DESIGNER', 'FREELANCER']}
              interval={2500}
              color="#f5f5f5"
              fontSize="clamp(2rem, 7vw, 6.5rem)"
              fontWeight={800}
              warpStrength={0.08}
              warpScale={1.7}
              speed={0.55}
              pointerInfluence={0.42}
              pointerStrength={0.38}
              refraction={0.018}
              ripple
            />
          </section>
        </AnimatedCard>
        <AnimatedCard direction="up" delay={0.15}>
          <section id="contato" className="flex scroll-mt-24 flex-col items-center justify-center gap-6 p-6 md:p-10" aria-label="Contato">
            <TextAnimate
              as="h2"
              animation="blurInUp"
              by="character"
              once
              className="text-4xl font-bold text-white md:text-5xl"
            >
              CONTATO
            </TextAnimate>
            <p className="text-center text-lg text-muted-foreground">
              Entre em contato para projetos freelancer.
            </p>
          </section>
        </AnimatedCard>
      </ClickSpark>
    </main>
  );
}

export default App;
