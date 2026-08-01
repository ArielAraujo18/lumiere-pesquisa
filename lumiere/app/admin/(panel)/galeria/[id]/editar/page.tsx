type EditGalleryItemPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditGalleryItemPage({
  params,
}: EditGalleryItemPageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Editar imagem da galeria</h1>
      <p>ID: {id}</p>
    </main>
  );
}