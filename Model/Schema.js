import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  toDo: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
});

export const todoModel = mongoose.model(`ToDo List`,todoSchema);