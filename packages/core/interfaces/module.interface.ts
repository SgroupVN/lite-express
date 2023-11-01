import { Router } from 'express';

export type ModuleProperty = { path?: string, bundler: (router: Router) => void }
export type ModuleFactory = (app: Router) => void;
