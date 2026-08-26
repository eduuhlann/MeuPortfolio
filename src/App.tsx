import CyclingWarpText from "@/components/ui/CyclingWarpText";
import AnimatedCard from "@/components/ui/AnimatedCard";
import ParallaxDemo from "@/demos/default";
import { SplineSceneBasic } from "@/demos/spline-demo";

function App() {
  return (
    <main className="w-full bg-background">
      <ParallaxDemo />
      <AnimatedCard direction="up" delay={0}>
        <section className="flex justify-center p-6 md:p-10">
          <div className="w-full max-w-5xl">
            <SplineSceneBasic />
          </div>
        </section>
      </AnimatedCard>
      <AnimatedCard direction="up" delay={0.15}>
        <section className="flex justify-center p-6 md:p-10" aria-label="FrontEnd">
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
    </main>
  );
}

export default App;
