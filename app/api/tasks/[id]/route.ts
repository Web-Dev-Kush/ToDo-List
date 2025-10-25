import { NextResponse } from "next/server";
import Task from "@/models/Task";
import { connectDB } from "@/lib/mongodb";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // 👈 await here
  await connectDB();
  const body = await request.json();
  const updated = await Task.findByIdAndUpdate(id, body, { new: true });

  if (!updated) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}


export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  await connectDB();
  const deleted = await Task.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}

