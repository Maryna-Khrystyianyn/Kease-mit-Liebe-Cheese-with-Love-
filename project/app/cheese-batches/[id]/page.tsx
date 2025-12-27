
import PageWrapper from "@/app/PageWraper";

interface PageProps {
  params: { id: string };
}

export default async function BatchPage({ params }: PageProps) {
  const { id } = await params;
  const batchId = Number(id);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/cheese-batches/${batchId}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) {
    return <p>Batch nicht gefunden</p>;
  }

  const batchData = await res.json();

  return (
    <PageWrapper>
<div>Hallo </div>
    </PageWrapper>
    
  );
}