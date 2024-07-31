import type { Content } from '@prismicio/client';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

import { createClient } from '@/prismicio';
import { getLocales } from '@/utils/getLocales';

import Drawer from './Drawer';
import { LanguageSwitcher } from './LanguageSwitcher';

type HeaderProps = {
  doc: Content.AllDocumentTypes;
};

export default async function Header({ doc }: HeaderProps) {
  const client = createClient();

  const meta = await client.getSingle('meta');
  const footer = await client.getSingle('footer');

  const locales = await getLocales(doc, client);

  return (
    <header>
      <p className="bg-black p-1 px-4 text-center text-sm uppercase text-white md:text-base">{meta.data.top_info}</p>
      <nav className="relative mb-6 mt-4 border-gray-200 bg-white p-4 md:px-12 lg:px-14 2xl:mb-14 2xl:mt-8 2xl:px-20">
        <div className="mx-auto flex flex-wrap items-center justify-between">
          <Drawer meta={meta} footer={footer} locales={locales} />
          <div className="absolute left-1/2 -translate-x-1/2">
            <PrismicNextLink field={meta.data.home_link}>
              <PrismicNextImage className="xl:h-18 h-14 w-auto md:h-16 2xl:h-20" field={meta.data.og_image} />
            </PrismicNextLink>
          </div>

          <div className="flex items-center justify-between gap-x-4 lg:flex lg:w-auto" id="mobile-menu-2">
            <ul className="font-base mt-4 hidden uppercase tracking-widest xl:mt-0 xl:flex xl:flex-row xl:space-x-6 2xl:space-x-8">
              {meta.data.navigation_right.map(({ link, label }) => (
                <li key={label}>
                  <PrismicNextLink
                    className="lg:hover:text-primary-700 block border-b border-gray-100 py-2 pl-3 pr-4 text-[0.95rem] hover:bg-gray-50 lg:border-0 lg:p-0 lg:hover:bg-transparent"
                    field={link}
                  >
                    {label}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-row gap-x-4 font-semibold uppercase lg:mt-0">
              <li className="hidden border-x-2 border-gray-900 px-2 xl:block">
                <LanguageSwitcher locales={locales} />
              </li>
              {meta.data.icons.map(({ link, icon }, index) => (
                <li key={index}>
                  <PrismicNextLink className="py-2" field={link}>
                    <PrismicNextImage className="h-5 w-auto" field={icon} />
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
