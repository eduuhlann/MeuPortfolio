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
    </main>
  );
}

export default App;
