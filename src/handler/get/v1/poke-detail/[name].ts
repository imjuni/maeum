import IReqPokeDetail from '@dto/v1/poke-detail/IReqPokeDetail';
import JSC_IRestError from '@module/http/JSC_IRestError';
import readPokeDetailByName from '@module/v1/readPokeDetailByName';
import IPokemonJsonSchema from '@schema/v1/poke-detail/IPokemon';
import IReqPokeDetailJsonSchema from '@schema/v1/poke-detail/IReqPokeDetail';
import serializerPokemonToWithTid from '@serializer/v1/serializerPokemonToWithTid';
import { FastifyRequest, RouteShorthandOptions } from 'fastify';

export const option: RouteShorthandOptions = {
  schema: {
    tags: ['Pokemon'],
    summary: 'Pokemon detail information using by name',
    querystring: IReqPokeDetailJsonSchema.properties?.Querystring,
    params: IReqPokeDetailJsonSchema.properties?.Params,
    response: {
      200: IPokemonJsonSchema,
      400: JSC_IRestError,
      500: JSC_IRestError,
    },
  },
};

export default async function readPokeDetailByNameHandler(req: FastifyRequest<IReqPokeDetail>) {
  const resp = await readPokeDetailByName(req.params.name);
  const serialized = serializerPokemonToWithTid(resp.data, req.query.tid);
  return serialized;
}
