import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";

export async function GET() {
    try {
      const faqs = await prisma.fAQ.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(faqs);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
    }
  }
  
  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { category, question, answer, tags } = body;
  
      if (!category || !question || !answer) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
  
      const newFAQ = await prisma.fAQ.create({
        data: {
          category,
          question,
          answer,
          tags,
        },
      });
  
      return NextResponse.json(newFAQ, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
    }
  }