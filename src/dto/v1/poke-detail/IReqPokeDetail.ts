export default interface IReqPokeDetail {
  Querystring: {
    /**
     * transaction id on each request
     * @format uuid
     */
    tid: string;
  };

  Params: {
    /**
     * Pokemon name
     */
    name: string;
  };
}
