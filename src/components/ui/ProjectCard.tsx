import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

interface ProjectCardProps {
  title: string
  description: string
  url: string
  tags?: string[]
}

export function ProjectCard({ title, description, url, tags }: ProjectCardProps) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="group w-full bg-black/[0.96] border-white/10 hover:border-white/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
        <CardHeader>
          <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            {title}
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between items-center">
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded-full text-neutral-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="text-sm text-white/70 group-hover:text-white transition-colors">
            Ver projeto &rarr;
          </span>
        </CardFooter>
      </Card>
    </a>
  )
}