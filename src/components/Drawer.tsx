'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { useEffect, useState } from 'react';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface LocaleProps {
  lang: string;
  url: string;
  lang_name: string;
}

interface DrawerProps {
  meta: Content.MetaDocument<string>;
  footer: Content.FooterDocument<string>;
  locales: LocaleProps[];
}

export default function Drawer({ meta, footer, locales }: DrawerProps) {
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    if (openDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [openDrawer]);

  return (
    <div className="flex items-center gap-x-6 2xl:gap-x-8">
      <div>
        <button
          data-collapse-toggle="mobile-menu-2"
          onClick={() => setOpenDrawer(!openDrawer)}
          type="button"
          className="ml-1 inline-flex items-center rounded-lg p-1.5 text-sm text-gray-900"
          aria-controls="mobile-menu-2"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg
            className="hidden size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        {openDrawer && (
          <div
            id="drawer-navigation"
            className={`fixed left-0 top-0 z-40 h-screen w-full overflow-y-auto bg-white px-12 py-32 transition-transform md:w-96 md:px-16 xl:w-72 ${
              openDrawer ? 'translate-x-0' : '-translate-x-full'
            }`}
            tabIndex={-1}
            aria-labelledby="drawer-navigation-label"
          >
            <div className="absolute left-6 top-6 flex w-5/6 items-center space-x-4 sm:left-10 md:left-14 md:top-16">
              <button
                type="button"
                onClick={() => setOpenDrawer(!openDrawer)}
                data-drawer-hide="drawer-navigation"
                aria-controls="drawer-navigation"
                className="inline-flex items-center bg-transparent p-1.5 text-sm text-black"
              >
                <svg
                  aria-hidden="true"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span className="sr-only">Close menu</span>
              </button>
              <PrismicNextLink field={meta.data.home_link} className="block w-5/6 md:hidden">
                <PrismicNextImage className="mx-auto h-16 w-auto sm:h-20" field={meta.data.og_image} />
              </PrismicNextLink>
            </div>
            <div className="overflow-y-auto py-6 md:py-4">
              <ul className="hidden space-y-4 font-medium xl:block">
                {meta.data.sidebar.map(({ link, label }) => (
                  <li key={label}>
                    <PrismicNextLink
                      className="block py-2 pl-3 pr-4 text-[0.95rem] font-semibold uppercase tracking-widest lg:p-0"
                      field={link}
                    >
                      {label}
                    </PrismicNextLink>
                  </li>
                ))}
              </ul>
              <ul className="block space-y-6 text-sm font-semibold xl:hidden">
                {meta.data.navigation.map(({ link, label, custom_action }) => (
                  <li key={label}>
                    {custom_action && custom_action === 'open_drawer' ? (
                      <ul className="space-y-4">
                        <li>
                          <PrismicNextLink
                            className="block pl-3 pr-4 uppercase tracking-widest lg:border-0 lg:p-0"
                            field={link}
                          >
                            {label}
                          </PrismicNextLink>
                        </li>
                        {meta.data.sidebar.map((item) => (
                          <li key={item.label} className="text-xs font-light">
                            <PrismicNextLink
                              className="block pl-3 pr-4 uppercase tracking-widest lg:p-0"
                              field={item.link}
                            >
                              {item.label}
                            </PrismicNextLink>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <PrismicNextLink
                        className="block py-2 pl-3 pr-4 uppercase tracking-widest lg:border-0 lg:p-0"
                        field={link}
                      >
                        {label}
                      </PrismicNextLink>
                    )}
                  </li>
                ))}
                {meta.data.navigation_right.map(({ link, label }) => (
                  <li key={label}>
                    <PrismicNextLink
                      className="block py-2 pl-3 pr-4 uppercase tracking-widest lg:border-0 lg:p-0"
                      field={link}
                    >
                      {label}
                    </PrismicNextLink>
                  </li>
                ))}
              </ul>
              <hr className="border-1 my-8 block w-full border-black lg:hidden" />
              <ul className="block space-y-6 text-sm font-semibold lg:hidden">
                {footer.data.navigation.map(({ link, label, logo }) => (
                  <li key={label}>
                    <li className="flex items-center">
                      <PrismicNextLink
                        className="block py-2 pl-3 pr-4 uppercase tracking-widest lg:border-0 lg:p-0"
                        field={link}
                      >
                        {label}
                      </PrismicNextLink>
                      {logo ? <PrismicNextImage field={logo} /> : null}
                    </li>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex w-full justify-end lg:hidden">
                <div className="border-x border-gray-900 px-2 font-semibold">
                  <LanguageSwitcher locales={locales} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ul className="font-base hidden flex-col uppercase tracking-widest xl:flex xl:w-auto xl:flex-row xl:space-x-6 2xl:space-x-8">
        {meta.data.navigation.map(({ link, label, custom_action }) => (
          <li key={label}>
            {custom_action && custom_action === 'open_drawer' ? (
              <button
                data-collapse-toggle="drawer-navigation"
                onClick={() => setOpenDrawer(!openDrawer)}
                type="button"
                className="font-base block py-2 pl-3 pr-4 text-[0.95rem] uppercase tracking-widest lg:border-0 lg:p-0"
              >
                {label}
              </button>
            ) : (
              <PrismicNextLink
                className="block py-2 pl-3 pr-4 text-[0.95rem] uppercase lg:border-0 lg:p-0"
                field={link}
              >
                {label}
              </PrismicNextLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
