import { createClient } from '@/prismicio';
import { getLocales } from '@/utils/getLocales';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { LanguageSwitcher } from './LanguageSwitcher';
import type { Content } from '@prismicio/client';
import Drawer from './Drawer';

type HeaderProps = {
  doc: Content.AllDocumentTypes;
};

export default async function Header({ doc }: HeaderProps) {
  const client = createClient();

  const meta = await client.getSingle('meta');
  const locales = await getLocales(doc, client);

  return (
    <header>
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-4 mb-6 2xl:mb-14">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-2xl">
          <Drawer meta={meta} />
          <PrismicNextLink field={meta.data.home_link}>
            <PrismicNextImage className="h-16 xl:h-18 2xl:h-20 w-auto" field={meta.data.og_image} />
          </PrismicNextLink>
          <div className="justify-between items-center lg:flex lg:w-auto gap-x-4" id="mobile-menu-2">
            <ul className="hidden mt-4 xl:flex xl:flex-row xl:space-x-6 2xl:space-x-8 xl:mt-0 font-medium uppercase tracking-widest">
              {meta.data.navigation_right.map(({ link, label }) => (
                <li key={label}>
                  <PrismicNextLink
                    className="block py-2 pr-4 pl-3 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0"
                    field={link}
                  >
                    {label}
                  </PrismicNextLink>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-row gap-x-4 lg:mt-0 font-semibold uppercase">
              <li className="xl:block hidden border-x-2 px-2 border-gray-900">
                <LanguageSwitcher locales={locales} />
              </li>
              {meta.data.icons.map(({ link, icon }) => (
                <li>
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
