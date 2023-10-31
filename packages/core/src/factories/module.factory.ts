import { Router } from 'express';

type ModuleProperty = { path: string, bundler: (router: Router) => void }
type ModuleFactory = (app: Router) => void;

export function createModuleFactory({ path, bundler }: ModuleProperty): ModuleFactory {
    const router = Router();

    if (!path || typeof path !== 'string') {
        throw new TypeError('Invalid path when calling createModuleFactory. Expected to be string');
    }

    return (app: Router) => {
        bundler(router);

        app.use(path, router);
    };
}
