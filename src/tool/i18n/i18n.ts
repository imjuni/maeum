import logging from '@logger/bootstrap';
import acceptLanguage from 'accept-language';
import fs from 'fs';
import { parse } from 'jsonc-parser';
import Polyglot from 'node-polyglot';
import path from 'path';
import { ReadonlyDeep } from 'type-fest';

const log = logging(__filename);

const internalLocales: Record<string, Polyglot> = {};
const locales: ReadonlyDeep<Record<string, Polyglot>> = internalLocales;

export async function bootstrap() {
  const localeDirPath = path.join(__dirname, '..', '..', '..', 'resources', 'locales');

  const supportLocales = await fs.promises.readdir(localeDirPath);

  log.trace('locale dir path: ', localeDirPath);
  log.trace('support language: ', supportLocales);

  acceptLanguage.languages(supportLocales);

  const loadedLocales = (
    await Promise.all(
      supportLocales.map(async (supportLocale) => {
        const namespaces = await fs.promises.readdir(path.join(localeDirPath, supportLocale));
        const locale = (
          await Promise.all(
            namespaces.map(async (namespace) => {
              return {
                [path.basename(namespace, path.extname(namespace))]: parse(
                  (
                    await fs.promises.readFile(path.join(localeDirPath, supportLocale, namespace))
                  ).toString(),
                ),
              };
            }),
          )
        ).reduce<Record<string, any>>((aggregation, namespace) => {
          return { ...aggregation, ...namespace };
        }, {});

        return { [supportLocale]: locale };
      }),
    )
  ).reduce<Record<string, any>>((aggregation, locale) => {
    return { ...aggregation, ...locale };
  }, {});

  Object.keys(loadedLocales).forEach((locale) => {
    internalLocales[locale] = new Polyglot({ locale, phrases: loadedLocales[locale] });
  });

  return loadedLocales;
}

export default locales;
