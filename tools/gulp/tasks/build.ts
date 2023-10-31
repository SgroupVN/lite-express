import { ROOT_PACKAGE_PATH } from './../config';
import { task, watch, series, dest } from 'gulp';
import { createProject, Project } from 'gulp-typescript';
import * as log from 'fancy-log';

const packages: Map<string, Project> = new Map(
    [
      ['core', createProject('packages/core/tsconfig.json')],
  ],
)

const modules: string[] = [];

for (const packageName of packages.keys()) {
  modules.push(packageName);
}


/**
 * TODO:
 * - In dev env, we want to stream the build in node_modules and copy to other folders
 * - In prod build, we want to build into the lib folder for publishing purposes
 */

const distId = process.argv.indexOf('--dist');
const distPath = distId > -1 ? process.argv[distId + 1] : ROOT_PACKAGE_PATH;

function streamingBuild() {
  log.info('Watching files..');
  modules.forEach(packageName => {
    watch(
      [`${ROOT_PACKAGE_PATH}/${packageName}/**/*.ts`,
      `${ROOT_PACKAGE_PATH}/${packageName}/*.ts`],
      series(packageName),
    );
  });
}

function buildPackage(packageName: string) {
  log(`Building ${packageName} to ${distPath}/${packageName}`);
  if (!packages.has(packageName)) {
    throw new Error(`Package ${packageName} does not exist`);
  }
  return (<Project> packages.get(packageName))
    .src()
    .pipe((<Project> packages.get(packageName))())
    .pipe(dest(`${distPath}/${packageName}/lib`));
}

function buildPackages(names: string[]) {
  names.forEach(packageName => {
    task(packageName, () => buildPackage(packageName));
  });
}

buildPackages(modules);

task('build', series(modules))
task('default', streamingBuild);
