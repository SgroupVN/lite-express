import type { Express } from 'express';
import { json, urlencoded } from 'express';
import * as methodOverride from 'method-override';
import { ModuleFactory } from './interfaces/module.interface';
import { httpExceptionHandler } from './outbound/http-exception-filter';
import { notFoundHandler } from './outbound/not-found.filter';

type SContainerPayload = {
  app: Express;
  rootModule: ModuleFactory
}

type SContainer = {
  run: () => void
}

export function createSExpressContainer({ app, rootModule }: SContainerPayload): SContainer {
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(methodOverride('X-HTTP-Method-Override'));

  rootModule(app);

  return {
    run: () => {
      app.use(httpExceptionHandler);
      app.use(notFoundHandler);
    }
  }
}
