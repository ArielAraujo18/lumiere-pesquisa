import { PublicationsHero } from "@/components/sections/publications/PublicationsHero";
import { PublicationsList } from "@/components/sections/publications/PublicationsList";

export default function PublicationsPage() {
  return (
    <main>
      <PublicationsHero />
      <PublicationsList />
    </main>
  );
}