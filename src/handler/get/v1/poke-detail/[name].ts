import {
  IReqPokeDetailParams,
  IReqPokeDetailQuerystring,
} from '@dto/v1/poke-detail/IReqPokeDetail';
import readPokeDetailByName from '@module/v1/readPokeDetailByName';
import serializerPokemonToWithTid from '@serializer/v1/serializerPokemonToWithTid';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Pokemon'],
    summary: 'Pokemon detail information using by name',
    querystring: { $ref: 'IReqPokeDetailQuerystring' },
    params: { $ref: 'IReqPokeDetailParams' },
    response: {
      200: { $ref: 'IPokemonDto' },
      400: { $ref: 'IRestError' },
      500: { $ref: 'IRestError' },
    },
  },
};

export default async function readPokeDetailByNameHandler(
  req: FastifyRequest<{ Querystring: IReqPokeDetailQuerystring; Params: IReqPokeDetailParams }>,
) {
  const resp = await readPokeDetailByName(req.params.name);
  const serialized = serializerPokemonToWithTid(resp.data, req.query.tid);
  return serialized;
}
