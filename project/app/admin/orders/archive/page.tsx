import OrdersClient from "./OrdersClient";
import PageWrapper from "@/app/PageWraper";

export const dynamic = "force-dynamic";

export default function ArchiveOrdersPage() {
  const perPage = 10;

  return (
    <PageWrapper>
      <OrdersClient perPage={perPage} />
    </PageWrapper>
  );
}
