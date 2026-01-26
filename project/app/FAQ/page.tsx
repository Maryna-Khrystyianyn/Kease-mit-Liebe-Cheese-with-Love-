import { prisma } from "@/lib/prisma";
import FAQList from "./FAQList";
import PageWrapper from "../PageWraper";


export type FAQ = {
    id: number;
    category: string;
    question: string;
    answer: string;
    tags?: string|null;
  };

export default async function AdminFAQPage() {

  const faqs:FAQ[] = await prisma.fAQ.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">FAQ</h1>
      <PageWrapper><FAQList faqs={faqs} /></PageWrapper>
    </div>
  );
}