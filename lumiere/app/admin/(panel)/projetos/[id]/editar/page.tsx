type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Editar projeto</h1>
      <p>ID: {id}</p>
    </main>
  );
}