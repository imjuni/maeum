import i18n from '@tool/i18n/i18n';
import { fallbackLng } from '@tool/i18n/i18nConfig';
import acceptLanguage from 'accept-language';
import Polyglot from 'node-polyglot';

export default function getLocales(languages?: string | string[]): Polyglot {
  try {
    if (languages == null) {
      return i18n[fallbackLng];
    }

    const [firstLanguage] = languages;

    if (firstLanguage == null) {
      return i18n[fallbackLng];
    }

    const language = acceptLanguage.get(firstLanguage);

    if (language == null) {
      return i18n[fallbackLng];
    }

    const expectPolyglot = i18n[language];

    if (expectPolyglot == null) {
      return i18n[fallbackLng];
    }

    return expectPolyglot;
  } catch {
    return i18n[fallbackLng];
  }
}
