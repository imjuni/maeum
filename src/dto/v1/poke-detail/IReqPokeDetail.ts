export interface IReqPokeDetailQuerystring {
  /**
   * transaction id on each request
   * @format uuid
   */
  tid: string;
}

export interface IReqPokeDetailParams {
  /**
   * Pokemon name
   */
  name: string;
}
