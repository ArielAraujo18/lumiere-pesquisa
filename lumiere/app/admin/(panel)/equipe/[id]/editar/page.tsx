type EditTeamMemberPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTeamMemberPage({
  params,
}: EditTeamMemberPageProps) {
  const { id } = await params;

  return (
    <main>
      <h1>Editar integrante</h1>
      <p>ID: {id}</p>
    </main>
  );
}