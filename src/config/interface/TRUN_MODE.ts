/* eslint-disable @typescript-eslint/naming-convention, @typescript-eslint/no-redeclare */
export const TRUN_MODE = {
  LOCAL: 'local',
  DEVELOP: 'develop',
  QA: 'qa',
  STAGE: 'stage',
  PRODUCTION: 'production',
} as const;

export type TRUN_MODE = typeof TRUN_MODE[keyof typeof TRUN_MODE];
