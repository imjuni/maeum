export default interface IPokemon {
  /** pokemon id */
  id: number;
  is_default: boolean;
  base_experience: number;
  /** pokemon height */
  height: number;

  location_area_encounters: string;
  name: string;
  order: number;

  species: {
    name: string;
    url: string;
  };
}
