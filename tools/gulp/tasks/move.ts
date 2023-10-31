import { dest, src, task } from 'gulp';
import { join } from 'path';
import { PROJECT_NAME, ROOT_SAMPLE_PATH } from '../config';
import { containsPackageJson, getDirs } from '../utils/task-helpers';

/**
 * Moves the compiled nest files into the `samples/*` dirs.
 */
function move() {
  const samplesDirs = getDirs(ROOT_SAMPLE_PATH);
  const distFiles = src([`node_modules/${PROJECT_NAME}/**/*`]);

  /**
   * Flatten the sampleDirs
   * If a sample dir contains does not contain a package.json
   * Push the subDirs into the destinations instead
   */
  const flattenedSampleDirs: string[] = [];

  for (const sampleDir of samplesDirs) {
    if (containsPackageJson(sampleDir)) {
      flattenedSampleDirs.push(sampleDir);
    } else {
      flattenedSampleDirs.push(...getDirs(sampleDir));
    }
  }

  return flattenedSampleDirs.reduce(
    (distFile, dir) => distFile.pipe(dest(join(dir, `/node_modules/${PROJECT_NAME}`))),
    distFiles,
  );
}

task('move', move);
