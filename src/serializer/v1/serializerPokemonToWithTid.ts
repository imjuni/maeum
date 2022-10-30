import IPokemonDto from '@dto/v1/poke-detail/IPokemonDto';

export default function serializerPokemonToWithTid(
  pokemon: IPokemonDto,
  tid: string,
): IPokemonDto & { tid: string } {
  return { ...pokemon, tid };
}
