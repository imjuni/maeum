import IReqPokeDetail from '@dto/v1/poke-detail/IReqPokeDetail';
import PokeDetailFrame from '@frame/PokeDetailFrame';
import RestError from '@module/http/RestError';
import httpStatusCodes from 'http-status-codes';
import { isError } from 'my-easy-fp';

export default async function readPokeDetailByName(name: IReqPokeDetail['Params']['name']) {
  const code = '44ea7ef11bdb4814af62de4c35d37dc5';

  try {
    if (name.toLowerCase() === 'guilmon') {
      throw new RestError({
        code,
        status: httpStatusCodes.BAD_REQUEST,
        message: 'guilmon is digimon character',
      });
    }

    const frame = new PokeDetailFrame({ name });
    const resp = await frame.execute();

    if (resp.type === 'fail') {
      throw new RestError({
        code,
        message: 'poke api call error',
        status: resp.fail.status,
      });
    }

    return resp.pass;
  } catch (catched) {
    const err = isError(catched) ?? new Error('unknown error raised from readPokeDetailByName');
    const restErr = new RestError({
      code,
      message: err.message,
      status: httpStatusCodes.INTERNAL_SERVER_ERROR,
    });

    restErr.stack = err.stack;

    throw restErr;
  }
}
