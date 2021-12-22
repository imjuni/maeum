import i18n from '@tool/i18n/i18n';
import { fallbackLng } from '@tool/i18n/i18nConfig';
import acceptLanguage from 'accept-language';
import { isEmpty } from 'my-easy-fp';
import Polyglot from 'node-polyglot';

export default function getLocales(languages?: string | string[]): Polyglot {
  try {
    if (isEmpty(languages)) {
      return i18n[fallbackLng];
    }

    const [firstLanguage] = languages;

    if (isEmpty(firstLanguage)) {
      return i18n[fallbackLng];
    }

    const language = acceptLanguage.get(firstLanguage);

    if (isEmpty(language)) {
      return i18n[fallbackLng];
    }

    const acceptPolyglot = i18n[language];

    if (isEmpty(acceptPolyglot)) {
      return i18n[fallbackLng];
    }

    return acceptPolyglot;
  } catch {
    return i18n[fallbackLng];
  }
}
