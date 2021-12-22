import TRunMode from '@config/interface/TRunMode';

/**
 * Maeum Boilerplate Server Application configuration
 */
export default interface IServer {
  /** server run mode */
  runMode: TRunMode;

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
