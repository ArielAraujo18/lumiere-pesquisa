export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  image: string;
  imageAlt: string;
  category: string;
  eventDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};