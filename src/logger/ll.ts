import debug from 'debug';
import { basename } from 'path';

const channel = 'maeum';

/**
 * @param channel 채널
 */
export default function ll(filename: string): debug.IDebugger {
  const debugChannel = process.env.DEBUG ?? '';
  if (debugChannel === undefined || debugChannel === null || debugChannel === '') {
    const nulllog: any = () => undefined; // eslint-disable-line
    return nulllog;
  }

  return debug(`${channel}:${basename(filename, '.ts')}`);
}
