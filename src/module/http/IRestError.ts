export default interface IRestError {
  code: string;
  message: string;
  payload?: any;
  status: number;
}
