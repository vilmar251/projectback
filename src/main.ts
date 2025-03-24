import express, { Request, Response } from "express";
import taskRouter from "./modules/task/task.router";

const server = express();

server.use(express.json());

const port = 2000;

server.get("/", (req: Request, res: Response) => {
  res.json({ message: "Ну привет!" });
});

server.use("/task", taskRouter);

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
