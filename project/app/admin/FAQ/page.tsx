import { prisma } from "@/lib/prisma";
import AdminFAQList from "./AdminFAQList";
import Link from "next/link";
import PageWrapper from "@/app/PageWraper";



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
         <Link href={"/admin"} className="text-(--text_gray) text-[14px] link-underline ">{`Admin Panel > `}</Link>
      <h1 className="text-2xl font-bold mb-4">Admin FAQ</h1>
      <PageWrapper><AdminFAQList faqs={faqs} /></PageWrapper>
    </div>
  );
}