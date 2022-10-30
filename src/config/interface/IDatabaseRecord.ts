import { JSONSchema7 } from 'json-schema';

export default interface IDatabaseRecord {
  id: string;
  filePath: string;
  import: {
    name: string;
    from: [];
  };
  export: {
    name: string;
    to: [];
  };
  dto: boolean;
  schema: JSONSchema7;
  rawSchema: string;
}
