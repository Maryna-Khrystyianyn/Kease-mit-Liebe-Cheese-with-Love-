import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "../../../utils/auth";

//GET

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const FAQId = Number(id);

  const faq = await prisma.fAQ.findUnique({
    where: { id: FAQId },
  });
  if (!faq) {
    return NextResponse.json({ message: "Nicht gefunden" }, { status: 404 });
  }
  return NextResponse.json(faq);
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    const FAQId = Number(id);
  
    const body = await req.json();
    const { category, question, answer, tags } = body;
  
    if (!category || !question || !answer) {
      return NextResponse.json(
        { message: "Fehlende erforderliche Felder" },
        { status: 400 }
      );
    }
  
    try {
      const updatedFAQ = await prisma.fAQ.update({
        where: { id: FAQId },
        data: { category, question, answer, tags },
      });
  
      return NextResponse.json(updatedFAQ);
    } catch (error) {
      return NextResponse.json(
        { message: "FAQ konnte nicht aktualisiert werden", error },
        { status: 500 }
      );
    }
  }

  export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    const FAQId = Number(id);
  
    try {
      await prisma.fAQ.delete({
        where: { id: FAQId },
      });
  
      return NextResponse.json(
        { message: "FAQ erfolgreich gelöscht" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "FAQ konnte nicht gelöscht werden", error },
        { status: 500 }
      );
    }
  }
