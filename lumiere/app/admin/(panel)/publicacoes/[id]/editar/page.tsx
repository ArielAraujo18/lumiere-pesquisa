type EditPublicationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPublicationPage({
  params,
}: EditPublicationPageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Editar publicação</h1>
      <p>ID: {id}</p>
    </main>
  );
}