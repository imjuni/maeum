export type TJSONValue = string | number | boolean | IJSONObject | IJSONArray | undefined;

export interface IJSONObject {
  [x: string]: TJSONValue;
}

// eslint-disable-next-line
export interface IJSONArray extends Array<TJSONValue> {}

export interface ILogFormat {
  status: number;
  duration?: number;
  req_method:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'HEAD'
    | 'OPTIONS'
    | 'TRACE'
    | 'PATCH'
    | 'CONNECT'
    | 'HTTPUNKNOWN'
    // kafka 작업을 받거나 해서 내가 작업한 것들
    | 'KAFKA'
    // kafka 드라이버 메시지
    | 'KAFKA_SYS'
    // 시스템 메시지
    | 'SYS'
    | 'SYSUNKNOWN'
    // 디버그 메시지 전용
    | 'DEBUG';

  // 여기는 고유 식별자
  req_url: string;
  curl_cmd?: string;
  err?: Error;
  err_msg?: string;
  err_stk?: string;

  body?: TJSONValue;
}
