import IPokemon from '@dto/v1/poke-detail/IPokemon';

export default function serializerPokemonToWithTid(
  pokemon: IPokemon,
  tid: string,
): IPokemon & { tid: string } {
  return { ...pokemon, tid };
}
