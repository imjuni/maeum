import IEndpoint from '@config/interface/IEndpoint';
import IServer from '@config/interface/IServer';

/** 서버 설정 */
export default interface IConfiguration {
  server: IServer;
  endpoint: IEndpoint;
}
