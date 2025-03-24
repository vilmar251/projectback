import express, { Request, Response } from "express";

const taskRouter = express.Router();

taskRouter.get("/", (req: Request, res: Response) => {
  res.json({ message: "Вы запросили все задачи" });
});

taskRouter.get("/:id", (req: Request, res: Response) => {
  res.json({ message: "Вы запросили задачу по id", id: req.params.id });
});

taskRouter.post("/", (req: Request, res: Response) => {
  res.json({ message: "Вы пытаетесь создать новую задачу" });
});

export default taskRouter;
