/* eslint-disable no-console, import/no-extraneous-dependencies */
import archiver from 'archiver';
import chalk from 'colors';
import dayjs from 'dayjs';
import figlet from 'figlet';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import shelljs from 'shelljs';
import * as uuid from 'uuid';

const time = () => dayjs().format('[yy-MM-dd HH:mm:ss]');
const artifactName = 'maeum-artifact';
const includeNodeModules = process.env.ENV_INCLUDE_NODE_MODULES === 'on';

(async () => {
  const distPath = 'dist';
  const artifactPath = 'artifact';
  const sourceFilePath = path.resolve(path.join(__dirname, '..'));

  const decorated = figlet.textSync('Artifact!', { font: 'Bloody' });
  console.log(chalk.red(decorated));
  console.log(chalk.yellow(`${time()} create compressed artifact file`));

  console.log(chalk.yellow(`${time()} rename dist > artifact`));
  shelljs.mv(distPath, artifactPath);

  console.log(
    chalk.yellow(
      `${time()} create package.json file for deply: remove version range(~, ^ character)`,
    ),
  );
  const parsedPackageJSON = JSON.parse(
    readFileSync(path.join(sourceFilePath, 'package.json')).toString(),
  );

  const artifactID = `${parsedPackageJSON.version.replace(/\./g, '_')}-${dayjs().format(
    'yyMMddHHmm',
  )}-${uuid.v4().replace(/-/g, '').substring(0, 8)}`;

  Object.keys(parsedPackageJSON.dependencies).forEach((key) => {
    parsedPackageJSON.dependencies[key] = parsedPackageJSON.dependencies[key]
      .replace('~', '')
      .replace('^', '');
  });

  writeFileSync(
    path.join(sourceFilePath, artifactPath, 'package.json'),
    JSON.stringify(parsedPackageJSON, null, 2),
  );

  console.log(chalk.yellow(`${time()} compress: ${artifactName}-${artifactID}.zip`));
  const artifactFilename = `${artifactName}-${artifactID}.zip`;
  const artifactZip = createWriteStream(path.join(sourceFilePath, artifactFilename));
  const compressor = archiver('zip', { zlib: { level: 9 } });

  if (includeNodeModules) {
    console.log(
      chalk.yellow(
        `${time()} include node_modules directory on compressed artifact file: ${artifactFilename}`,
      ),
    );
  }

  compressor.pipe(artifactZip);
  compressor.directory(artifactPath, false); // compress directory using by recursive

  if (includeNodeModules) {
    compressor.directory(path.join(sourceFilePath, 'node_modules'), 'node_modules'); // compress directory using by recursive
  } else {
    console.log(
      chalk.yellow(
        `${time()} ${chalk.red(
          'warn',
        )} exclude node_modules directory on compressed artifact file: ${artifactFilename}`,
      ),
    );
  }

  compressor.directory(path.join(sourceFilePath, 'src'), 'src'); // compress directory using by recursive

  await compressor.finalize();

  shelljs.mv(
    path.join(sourceFilePath, artifactFilename),
    path.join(sourceFilePath, artifactPath, artifactFilename),
  );

  if (os.platform() !== 'win32') {
    shelljs.ln(
      '-s',
      path.join(sourceFilePath, 'node_modules'),
      path.join(artifactPath, 'node_modules'),
    );
  }
})();
