import type { Express } from 'express';
import { json, urlencoded } from 'express';
import methodOverride from 'method-override';
import { ModuleFactory } from './interfaces/module.interface';
import { httpExceptionHandler } from './outbound/http-exception-filter';
import { notFoundHandler } from './outbound/not-found.filter';

type SContainer = {
  app: Express;
  rootModule: ModuleFactory
}

export function createSExpressContainer({ app, rootModule }: SContainer): void {
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(methodOverride('X-HTTP-Method-Override'));

  rootModule(app);

  app.use(httpExceptionHandler);
  app.use(notFoundHandler);
}
