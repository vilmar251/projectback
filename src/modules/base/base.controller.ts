import express, { Request, Response, Router } from 'express';

export abstract class BaseController {
  protected router: Router;

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  protected abstract setupRoutes(): void;

  protected addRoute(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    handler: (req: Request, res: Response) => void | Promise<void>,
  ): void {
    this.router[method](path, handler.bind(this));
  }

  public getRouter(): Router {
    return this.router;
  }
}
