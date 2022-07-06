import { bootstrap as configBootstrap } from '@config/config';
import getRunMode from '@config/module/getRunMode';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({
  path: path.join(
    process.cwd(),
    'src',
    'config',
    'files',
    `config.${getRunMode(process.env.RUN_MODE ?? 'local')}.env`,
  ),
});

configBootstrap();
