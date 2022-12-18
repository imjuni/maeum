import type { TRUN_MODE } from '@config/interface/TRUN_MODE';

/**
 * return validate run-mode
 *
 * @returns TRUN_MODE
 */
export default function getRunMode(envRunMode?: string): TRUN_MODE {
  const runMode = envRunMode ?? process.env.RUN_MODE ?? 'local';

  if (
    runMode !== 'local' &&
    runMode !== 'develop' &&
    runMode !== 'qa' &&
    runMode !== 'stage' &&
    runMode !== 'production'
  ) {
    throw new Error(`invalid run_mode: ${runMode}`);
  }

  return runMode;
}
