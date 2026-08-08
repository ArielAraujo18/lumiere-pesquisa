export type PublicationStatus = "Publicado" | "Rascunho";
export type PublicationType =
  | "Artigo"
  | "Evento"
  | "Relatório"
  | "Resumo"
  | "Livro"
  | "Capítulo"
  | "Outro";

export interface Publication {
  id: string;
  title: string;
  slug: string;
  authors: string;
  year: number;
  type: PublicationType;
  venue: string;
  status: PublicationStatus;
  abstract: string;
  doi?: string;
  url?: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationPayload {
  title: string;
  authors: string;
  year: string;
  type: PublicationType;
  venue: string;
  status: PublicationStatus;
  abstract: string;
  doi: string;
  url: string;
  featured: boolean;
}
