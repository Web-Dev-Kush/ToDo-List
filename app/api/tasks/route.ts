import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  await connectDB();
  const tasks = await Task.find().sort({ createdAt: -1 });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  await connectDB();
  const { text } = await request.json();
  const newTask = await Task.create({ text, completed: false });
  return NextResponse.json(newTask);
}
