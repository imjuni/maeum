import { FastifyInstance } from 'fastify';
import {
  IReqPokeDetailParams,
  IReqPokeDetailQuerystring,
} from '../dto/v1/poke-detail/IReqPokeDetail';
import readPokeDetailByNameHandler_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE, {
  option as option_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE,
} from './get/v1/poke-detail/[name]';

export default function routing(fastify: FastifyInstance): void {
  fastify.get<{ Querystring: IReqPokeDetailQuerystring; Params: IReqPokeDetailParams }>(
    '/v1/poke-detail/:name',
    option_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE,
    readPokeDetailByNameHandler_azm7AyTKp3gXvsxGx1OUnVrEH7b0dgLE,
  );
}
