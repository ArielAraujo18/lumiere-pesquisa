type NewsPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default function NewsPage() {
    return (
        <main>
            <h1>Notícias do grupo Lumière</h1>
        </main>
    );
}