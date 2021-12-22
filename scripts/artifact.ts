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

(async () => {
  const distPostfixPath = 'dist';
  const artifactPath = 'artifact';
  const sourceFilePath = path.resolve(path.join(__dirname, '..'));
  const distPath = path.join(sourceFilePath, artifactPath, distPostfixPath);

  const decorated = figlet.textSync('Artifact!', { font: 'Bloody' });
  console.log(chalk.red(decorated));
  console.log(chalk.yellow(`${time()} 배포용 아티펙트 zip 파일을 생성합니다`));

  console.log(chalk.yellow(`${time()} artifact 디렉터리를 생성하고, dist 디렉터리를 이동합니다`));
  shelljs.mkdir('-p', artifactPath);
  shelljs.mv(distPostfixPath, artifactPath);

  console.log(chalk.yellow(`${time()} 배포용 package.json 파일을 생성합니다`));
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

  console.log(chalk.yellow(`${time()} resources 파일을 복사합니다`));
  shelljs.cp('-r', path.join(sourceFilePath, 'resources'), path.join(distPath, 'resources'));

  console.log(chalk.yellow(`${time()} ${artifactName}-${artifactID}.zip 파일로 압축합니다`));
  const artifactFilename = `${artifactName}-${artifactID}.zip`;
  const artifactZip = createWriteStream(path.join(sourceFilePath, artifactFilename)); // write stream 만들고,
  const compressor = archiver('zip', { zlib: { level: 9 } });

  console.log(chalk.yellow(`${time()} node_modules 디렉터리를 포함하여 압축을 진행합니다`));

  compressor.pipe(artifactZip);
  compressor.directory(artifactPath, false); // directory를 recursive로 압축
  compressor.directory(path.join(sourceFilePath, 'node_modules'), 'node_modules'); // directory를 recursive로 압축
  compressor.directory(path.join(sourceFilePath, 'src'), 'src'); // directory를 recursive로 압축

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
