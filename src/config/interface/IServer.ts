import { TRUN_MODE } from '@config/interface/TRUN_MODE';

/**
 * Maeum Boilerplate Server Application configuration
 */
export default interface IServer {
  /** server run mode */
  runMode: TRUN_MODE;

  /** NODE_ENV */
  envMode: string;

  /** log level */
  logLevel: string;

  /** caller configuration, server name */
  caller: string;

  /** server port */
  port: number;

  /** swagger host */
  swaggerHost: string;
}
