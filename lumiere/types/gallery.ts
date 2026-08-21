export type GalleryStatus = "Publicado" | "Rascunho";

export type GalleryPayload = {
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  status: GalleryStatus;
  order: number;
};

export type GalleryItem = GalleryPayload & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};
