import mongoose, { Schema, models } from "mongoose";

const TaskSchema = new Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Task = models.Task || mongoose.model("Task", TaskSchema);
export default Task;
