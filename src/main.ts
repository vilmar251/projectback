import express, { Request, Response } from 'express';

const server = express();
const a: string = '';
const b: string = '';

if (a == b) {
}
const port = 2000;
server.get('/task/:id', (request: Request, res: Response) => {
  const id = request.params.id;
  res.json({ message: `Вы запросили id=${id}` });
});
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
