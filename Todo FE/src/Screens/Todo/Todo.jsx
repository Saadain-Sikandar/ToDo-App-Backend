import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  InputGroup,
  ListGroup,
} from "react-bootstrap";
import Swal from "sweetalert2";
import { Base_Uri } from "../../Utils/uri";
import styles from "./Todo.module.css";

function Todo() {
  const [task, setTask] = useState("");
  const [records, Setrecords] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    GetallTodo();
  }, [refresh]);

  const GetallTodo = async () => {
    try {
      const getData = await axios.get(`${Base_Uri}api/todolist`);
      console.log(getData.data);
      Setrecords(getData.data.toDolist);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error Fetching Data!",
        icon: "error",
        draggable: true,
      });
    }
  };

  const Addtask = async () => {
    try {
      if (task) {
        await axios.post(`${Base_Uri}api/addtodo`, { toDo: task });
        setTask("");
        Swal.fire({
          title: "Task Added!",
          icon: "success",
          draggable: true,
        });
        setRefresh(!refresh);
      } else {
        Swal.fire("No task entered!");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DeleteTask = async (id) => {
    try {
      await axios.delete(`${Base_Uri}api/deletetodo/${id}`);
      Swal.fire({
        title: "Task Deleted!",
        icon: "success",
        draggable: true,
      });
      setRefresh(!refresh);
    } catch (error) {
      console.log(error);
    }
  };

  const EditTask = async (id, todo) => {
    try {
      let editedval = prompt("Edit task:", todo);
      if (editedval) {
        const Updated = await axios.put(`${Base_Uri}api/updatetodo/${id}`, {
          toDo: editedval,
        });
        Swal.fire({
          title: "Task updated!",
          icon: "success",
          draggable: true,
        });
        setRefresh(!refresh);
      } else {
        Swal.fire("Task not updated.");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center">
      <Card
        className={`shadow rounded-4 p-2 w-100 ${styles.card} `}
        style={{ maxWidth: `600px` }}
      >
        <Card.Body className="text-center">
          <h2 className={`text-center mb-4 ${styles.h2} `}>📝 ToDo App</h2>

          {/* Input + Add Task */}
          <InputGroup className="mb-3 shadow-sm  ">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a task..."
              onChange={(e) => setTask(e.target.value)}
              value={task}
            />
            <Button onClick={Addtask} variant="primary ms-2 border rounded ">
              Add Task
            </Button>
          </InputGroup>

          {/* Task List*/}
          <ListGroup className="shadow-sm">
            {records.map((e, i) => (
              <ListGroup.Item
                key={i}
                className="d-flex justify-content-between align-items-center"
              >
                {i + 1} <span>{e.toDo}</span>
                <div>
                  <Button
                    onClick={() => DeleteTask(e._id)}
                    variant="outline-danger"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => EditTask(e._id, e.toDo)}
                    variant="outline-success ms-2 "
                  >
                    Edit
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {/* <div className="mt-4">
            <Button
              onClick={DeleteAll}
              className="btn btn-danger ms-2 border rounded"
            >
              Delete All
            </Button>
          </div> */}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Todo;
