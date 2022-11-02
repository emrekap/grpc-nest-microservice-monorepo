import fs from 'fs';
import path from 'path';
import { configs } from './envconfig';

export type EnvironmentValue = string | number | boolean;
export type EnvironmentKeyValues = Record<string, EnvironmentValue>;
export interface Config {
  dir: string;
  filename: string;
  variables: EnvironmentKeyValues;
}

const DISCLAIMER = [
  '# This is a generated file.',
  '# DO NOT MODIFY.',
  `# Go to 'src/config/envconfig.ts' to make changes.`,
  '',
].join('\n');

const environmentValueToString = (value: EnvironmentValue): string => {
  if (typeof value === 'boolean') {
    if (value) {
      return 'true';
    } else {
      return 'false';
    }
  } else {
    return `${value}`;
  }
};

const toDotEnv = (environmentVariable: EnvironmentKeyValues) => {
  const lines = [DISCLAIMER];
  Object.keys(environmentVariable).forEach((key) => {
    const value = environmentVariable[key];
    const finalEnvironmentValue = environmentValueToString(value);
    const line = `${key}=${finalEnvironmentValue}`;
    lines.push(line);
  });
  lines.push('');
  lines.push(DISCLAIMER);
  return lines.join('\n');
};

export const generate = () => {
  configs.forEach((config) => {
    const { filename, dir, variables } = config;
    const dotenv = toDotEnv(variables);
    const filepath = path.join(dir, filename);

    fs.rmSync(filepath, {
      force: true,
    });

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true,
      });
    }

    fs.writeFileSync(filepath, dotenv, {
      encoding: 'utf-8',
    });
  });

  console.log('Successfully generated environment variables.');
};

generate();
