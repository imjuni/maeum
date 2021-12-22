import config from '@config/config';
import IPokemon from '@dto/v1/poke-detail/IPokemon';
import { JinFrame } from 'jin-frame';
import path from 'path';

interface IPokeDetailQueryParams {
  name: IPokemon['name'];
}

export default class PokeDetailQuery extends JinFrame<IPokemon> {
  @JinFrame.param()
  name: string;

  constructor(data: IPokeDetailQueryParams) {
    super({
      host: path.posix.join(config.endpoint.pokeapi, 'api/v2/pokemon/:name'),
      method: 'get',
    });

    this.name = data.name;
  }
}
