"use client";

import { NotFoundGlitch } from "@/components/ui/be-ui-404-not-found";

export default function NotFoundGlitchPreview() {
  return (
    <div className="w-full">
      <NotFoundGlitch
        code="404"
        title="Página não encontrada"
        description="A página que você está procurando não existe ou foi movida."
        homeHref="/"
        homeLabel="Voltar ao início"
        browseHref="/"
        browseLabel="Ver páginas"
      />
    </div>
  );
}
