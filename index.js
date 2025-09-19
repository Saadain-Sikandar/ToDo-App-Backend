import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { todoModel } from "./Model/Schema.js";

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(cors());

const MONGOOSE_URI = `mongodb+srv://admin:admin123@cluster0.bwtwqsv.mongodb.net/`;

mongoose
  .connect(MONGOOSE_URI)
  .then((res) => {
    console.log("Mongo DB is connected");
  })
  .catch((err) => {
    console.log(err);
  });

//   Add toDo

app.post("/api/addtodo", async (req, res) => {
  try {
    const { toDo } = req.body;
    if (!toDo) {
      res.status(404).json({
        message: "Please Add Task!",
        status: false,
      });
    }
    const addData = await todoModel.create({ toDo });
    res.status(201).json({
      message: "Task Added Successfully.",
      addData,
      status: true,
    });
  } catch (error) {
    console.error("error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ error: "Task already exists" });
    }
    return res.status(500).json({ error: "Internal Server Error!" });
  }
});

// Get all todos

app.get("/api/todolist", async (req, res) => {
  try {
    const toDolist = await todoModel.find();
    res.status(200).json({
      toDolist,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "interal server error!",
    });
  }
});

// update Todo
app.put("/api/updatetodo/:id", async (req, res) => {
  try {
    const { toDo } = req.body;
    const { id } = req.params;

    if (!toDo) {
      res.status(404).json({
        message: "Task not Found!",
      });
    }
    const updatetoDo = await todoModel.findByIdAndUpdate(
      id,
      { toDo },
      { new: true, runValidators: true }
    );

    if (!updatetoDo) {
      res.status(404).json({
        message: "Task Not Updated Successfully!",
        status: false,
      });
    }

    res.status(200).json({
      message: "Task Updated.",
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal Server Error!",
    });
  }
});

// Delete Todo
app.delete("/api/deletetodo/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletetodo = await todoModel.findByIdAndDelete(id);

    if (!deletetodo) {
      res.status(404).json({
        message: "Task Not Deleted Successfully,not Found!",
        status: false,
      });
    }

    res.status(200).json({
      message: "Task deleted.",
      deletetodo,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal Server Error!",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is now running at http://localhost:${PORT}`);
});
