import type TRunMode from '@config/interface/TRunMode';

/**
 * process.env에서 RUN_MODE를 읽어서 검증 후 반환한다
 * 주의> 이 함수는 logging에서도 사용하기 때문에 logging을 호출하지 마라
 * @returns 서버 실행 환경설정을 반환한다
 */
export default function getRunMode(envRunMode?: string): TRunMode {
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
