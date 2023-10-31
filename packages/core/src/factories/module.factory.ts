import { Router, Express } from 'express';

type ModuleProperty = { path: string, bundler: (router: Router) => void }
type ModuleFactory = (app: Router) => void;

export function createModuleFactory({ path, bundler }: ModuleProperty): ModuleFactory {
    const router = Router();

    return (app: Router) => {
        bundler(router);

        app.use(path, router);
    };
}
