export type News = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  status: "draft" | "published";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};