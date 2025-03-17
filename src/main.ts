import express, {Request, Response}from "express";

const server = express();

const port = 3000
server.get('/task/:id', (request: Request, res: Response) => {
const id = request.params.id
  res.json({message:`Вы запросили id=${id}`})
})
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
})