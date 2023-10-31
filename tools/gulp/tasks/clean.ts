import { task, src, series,  } from 'gulp';
import { ROOT_PACKAGE_PATH } from '../config';
import * as clean from 'gulp-clean';
import * as deleteEmpty from 'delete-empty';

/**
 * Cleans the build output assets from the packages folders
 */
function cleanOutput() {
  return src(
    [
      `${ROOT_PACKAGE_PATH}/**/*.js`,
      `${ROOT_PACKAGE_PATH}/**/*.d.ts`,
      `${ROOT_PACKAGE_PATH}/**/*.js.map`,
      `${ROOT_PACKAGE_PATH}/**/*.d.ts.map`,
    ],
    {
      read: false,
    },
  ).pipe(clean());
}

/**
 * Cleans empty dirs
 */
function cleanDirs(done: () => void) {
  deleteEmpty.sync(`${ROOT_PACKAGE_PATH}/`);
  done();
}

task('clean:output', cleanOutput);
task('clean:dirs', cleanDirs);

task('clean:bundle', series('clean:output', 'clean:dirs'));
