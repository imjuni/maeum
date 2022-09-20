/* eslint-disable no-console, import/no-extraneous-dependencies */
import archiver from 'archiver';
import chalk from 'chalk';
import dayjs from 'dayjs';
import figlet from 'figlet';
import { createWriteStream, readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import shelljs from 'shelljs';
import * as uuid from 'uuid';

function log(color: chalk.ChalkFunction, ...args: string[]) {
  const today = dayjs();
  console.log(color(`${today.format('[[]YY-MM-DD HH:mm:ss]')}`), ...args);
}

const artifactName = 'maeum-artifact';
const includeNodeModules = process.env.ENV_INCLUDE_NODE_MODULES === 'on';

(async () => {
  const distPath = 'dist';
  const artifactPath = 'artifact';
  const sourceFilePath = path.resolve(path.join(__dirname, '..'));

  const decorated = figlet.textSync('Artifact!', { font: 'Bloody' });
  console.log(chalk.red(decorated));
  log(chalk.yellow, chalk.yellow('create compressed artifact file'));

  log(chalk.yellow, chalk.yellow('rename dist > artifact'));
  shelljs.mkdir('-p', artifactPath);
  shelljs.mv(distPath, artifactPath);

  log(
    chalk.yellow,
    chalk.yellow(`create package.json file for deply: remove version range(~, ^ character)`),
  );
  const parsedPackageJSON = JSON.parse(
    readFileSync(path.join(sourceFilePath, 'package.json')).toString(),
  );

  const artifactID = `${parsedPackageJSON.version.replace(/\./g, '_')}-${dayjs().format(
    'YYMMDDHHmm',
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
  shelljs.cp(
    path.join(sourceFilePath, 'package-lock.json'),
    path.join(sourceFilePath, artifactPath, 'package-lock.json'),
  );

  shelljs.cp(
    '-r',
    path.join(sourceFilePath, '.config'),
    path.join(sourceFilePath, artifactPath, '.config'),
  );

  shelljs.cp(
    '-r',
    path.join(sourceFilePath, 'resources'),
    path.join(sourceFilePath, artifactPath, 'resources'),
  );

  shelljs.mkdir('-p', path.join(sourceFilePath, artifactPath, 'src', 'config'));
  shelljs.cp(
    '-r',
    path.join(sourceFilePath, 'src', 'config', 'files'),
    path.join(sourceFilePath, artifactPath, 'src', 'config'),
  );

  shelljs.mkdir('-p', path.join(sourceFilePath, artifactPath, 'dist'));
  shelljs.cp(
    '-r',
    path.join(sourceFilePath, 'src', 'config', 'files'),
    path.join(sourceFilePath, artifactPath, 'src', 'config'),
  );

  log(chalk.yellow, chalk.yellow(`compress: ${artifactName}-${artifactID}.zip`));
  const artifactFilename = `${artifactName}-${artifactID}.zip`;
  const artifactZip = createWriteStream(path.join(sourceFilePath, artifactFilename));
  const compressor = archiver('zip', { zlib: { level: 9 } });

  if (includeNodeModules) {
    console.log(
      chalk.yellow,
      chalk.yellow(
        `include node_modules directory on compressed artifact file: ${artifactFilename}`,
      ),
    );
  }

  compressor.pipe(artifactZip);
  compressor.directory(artifactPath, false); // compress directory using by recursive

  if (includeNodeModules) {
    compressor.directory(path.join(sourceFilePath, 'node_modules'), 'node_modules'); // compress directory using by recursive
  } else {
    log(
      chalk.yellow,
      chalk.yellow(
        `${chalk.red(
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
