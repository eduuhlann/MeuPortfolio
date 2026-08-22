import DepthText from "@/components/ui/DepthText";
import ParallaxDemo from "@/demos/default";
import { SplineSceneBasic } from "@/demos/spline-demo";

function App() {
  return (
    <main className="w-full bg-background">
      <ParallaxDemo />
      <section className="flex justify-center p-6 md:p-10">
        <div className="w-full max-w-5xl">
          <SplineSceneBasic />
        </div>
      </section>
      <section className="flex justify-center p-6 md:p-10" aria-label="FrontEnd">
        <DepthText
          text="FrontEnd"
          layers={34}
          depth={2.4}
          faceColor="#f5f5f5"
          depthColor="#4f8cff"
          tilt={7.5}
          pointerTracking
          smoothing={0.14}
          perspective={900}
          autoOrbit
          orbitSpeed={0.35}
          fontSize="clamp(3rem, 12vw, 7rem)"
          fontWeight={900}
          shadow
        />
      </section>
    </main>
  );
}

export default App;
