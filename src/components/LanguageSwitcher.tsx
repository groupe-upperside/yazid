'use client';

import { PrismicNextLink } from '@prismicio/next';
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

  return (
    <div ref={dropdownRef} className="relative inline-block w-full max-w-xs">
      <div
        className="block w-full cursor-pointer bg-white p-2 text-base text-gray-900 focus:outline-none"
        onClick={toggleDropdown}
      >
        {localeLabels[selectedLocale.lang as keyof typeof localeLabels] || selectedLocale.lang_name}
      </div>
      {isOpen && (
        <ul className="absolute left-0 z-10 mt-1 w-full rounded-md bg-white shadow-lg">
          {locales.map((locale) => (
            <li key={locale.lang} className="cursor-pointer hover:bg-gray-50">
              <PrismicNextLink
                href={locale.url}
                locale={locale.lang}
                aria-label={`Change language to ${locale.lang_name}`}
                className="block p-2 text-base text-gray-900"
                onClick={() => handleLocaleChange(locale)}
              >
                {localeLabels[locale.lang as keyof typeof localeLabels] || locale.lang_name}
              </PrismicNextLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
