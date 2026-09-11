import { LinkPreview } from "@/components/ui/link-preview";

export default function LinkPreviewDemo() {
  return (
    <div className="flex justify-center items-start h-[40rem] flex-col px-4">
      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl text-left mb-10">
        Visit{" "}
        <LinkPreview
          url="https://aceship.github.io/AN-EN-Tags/"
          className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-500 to-pink-500"
        >
          Aceternity UI
        </LinkPreview>{" "}
        and for amazing Tailwind and Framer Motion components.
      </p>

      <p className="text-neutral-500 dark:text-neutral-400 text-xl md:text-3xl max-w-3xl text-left">
        I listen to{" "}
        <LinkPreview
          url="https://example.com/profile"
          imageSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&q=50"
          isStatic
          className="font-bold"
        >
          this guy
        </LinkPreview>{" "}
        and I watch{" "}
        <LinkPreview
          url="/templates"
          imageSrc="https://images.unsplash.com/photo-1461151304267-38535e780c79?w=640&q=50"
          isStatic
          className="font-bold"
        >
          this movie
        </LinkPreview>{" "}
        twice a day
      </p>
    </div>
  );
}