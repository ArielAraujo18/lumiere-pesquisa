import { NewsHero } from "@/components/sections/news/NewsHero";
import { NewsGrid } from "@/components/sections/news/NewsGrid";
  
export default function NewsPage() {
  return (
    <main>
      <NewsHero />
      <NewsGrid />
    </main>
  );
}