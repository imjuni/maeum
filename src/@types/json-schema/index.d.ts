import 'json-schema';

declare module 'json-schema' {
  export interface JSONSchema7 {
    dateformatex?: string;
    example?: string;
    collectionFormat?: 'csv' | 'ssv' | 'tsv' | 'pipes' | 'multi';
  }
}
