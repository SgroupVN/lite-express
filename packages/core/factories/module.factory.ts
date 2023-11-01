import { Router } from 'express';
import { ModuleFactory, ModuleProperty } from '../interfaces/module.interface';

export function createModuleFactory({ path, bundler }: ModuleProperty): ModuleFactory {
    const router = Router();

    return (app: Router) => {
        bundler(router);

        if (path) {
            app.use(path, router);
            return;
        }

        app.use(router);
    };
}
