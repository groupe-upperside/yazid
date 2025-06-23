'use client';

import { useEffect, useRef, useState } from 'react';

interface LanguageSwitcherProps {
  locales: {
    lang: string;
    lang_name: string;
    url: string;
  }[];
}

const localeLabels = {
  'en-us': 'EN',
  'fr-fr': 'FR',
};

export const LanguageSwitcher = ({ locales }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locales[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLocaleChange = (locale: { lang: string; lang_name: string; url: string }) => {
    setSelectedLocale(locale);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const lang2 = selectedLocale.lang.slice(0, 2);

    const apply = () => window.Snipcart?.api?.session.setLanguage?.(lang2);

    if (window.Snipcart?.store?.getState?.().session?.lang) {
      apply();
      return;
    }

    document.addEventListener('snipcart.ready', apply, { once: true });
    // eslint-disable-next-line consistent-return
    return () => document.removeEventListener('snipcart.ready', apply);
  }, [selectedLocale.lang]);

  return (
    <div ref={dropdownRef} className="relative inline-block w-full max-w-xs">
      <div className="block w-full cursor-pointer bg-white px-0.5 text-base text-gray-900 focus:outline-none xl:hidden">
        {locales.map((locale, index) => (
          <a
            key={locale.lang}
            href={locale.url}
            aria-label={`Change language to ${locale.lang_name}`}
            className={`inline-block p-2 text-sm text-gray-900 ${index !== 0 ? 'border-l border-black pl-4' : 'pr-4'}`}
            onClick={() => handleLocaleChange(locale)}
          >
            {localeLabels[locale.lang as keyof typeof localeLabels] || locale.lang_name}
          </a>
        ))}
      </div>
      <div className="hidden xl:block">
        <div
          className="block w-full cursor-pointer bg-white px-0.5 text-base text-gray-900 focus:outline-none 2xl:text-base"
          onClick={toggleDropdown}
        >
          {localeLabels[selectedLocale.lang as keyof typeof localeLabels] || selectedLocale.lang_name}
        </div>
        {isOpen && (
          <ul className="absolute left-0 z-10 mt-1 w-auto rounded-md bg-white shadow-lg">
            {locales.map((locale) => (
              <li key={locale.lang} className="cursor-pointer hover:bg-gray-50">
                <a
                  href={locale.url}
                  aria-label={`Change language to ${locale.lang_name}`}
                  className="block p-2 text-sm text-gray-900 2xl:text-base"
                  onClick={() => handleLocaleChange(locale)}
                >
                  {localeLabels[locale.lang as keyof typeof localeLabels] || locale.lang_name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
