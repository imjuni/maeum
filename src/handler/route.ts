import { FastifyInstance } from 'fastify';
import IReqPokeDetail_vXR9OJd16Mi7ErFH2ubii3pmfPI8wKyi from '../dto/v1/poke-detail/IReqPokeDetail';
import readPokeDetailByNameHandler_0subagxb2viNfout3Z8hQOjjpZPv5L8u, {
  option as option_0subagxb2viNfout3Z8hQOjjpZPv5L8u,
} from './get/v1/poke-detail/[name]';

export default function routing(fastify: FastifyInstance): void {
  fastify.get<IReqPokeDetail_vXR9OJd16Mi7ErFH2ubii3pmfPI8wKyi>(
    '/v1/poke-detail/:name',
    option_0subagxb2viNfout3Z8hQOjjpZPv5L8u,
    readPokeDetailByNameHandler_0subagxb2viNfout3Z8hQOjjpZPv5L8u,
  );
}
