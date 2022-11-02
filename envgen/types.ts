export type EnvironmentValue = string | number | boolean;
export type EnvironmentKeyValues = Record<string, EnvironmentValue>;
export interface Config {
  dir: string;
  filename: string;
  variables: EnvironmentKeyValues;
}
