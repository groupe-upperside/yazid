'use client';

import type { Content } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import { useState } from 'react';

interface DrawerProps {
  meta: Content.MetaDocument<string>;
}

export default function Drawer({ meta }: DrawerProps) {
  const [openDrawer, setOpenDrawer] = useState(false);

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
            className={`fixed left-0 top-0 z-40 h-screen w-72 overflow-y-auto bg-white px-16 py-32 transition-transform${
              openDrawer ? 'translate-x-0' : '-translate-x-full'
            }`}
            tabIndex={-1}
            aria-labelledby="drawer-navigation-label"
          >
            <button
              type="button"
              onClick={() => setOpenDrawer(!openDrawer)}
              data-drawer-hide="drawer-navigation"
              aria-controls="drawer-navigation"
              className="absolute start-14 top-16 inline-flex items-center bg-transparent p-1.5 text-sm text-black"
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
            <div className="overflow-y-auto py-4">
              <ul className="space-y-4 font-medium">
                {meta.data.sidebar.map(({ link, label }) => (
                  <li key={label}>
                    <PrismicNextLink
                      className="block py-2 pl-3 pr-4 font-semibold uppercase tracking-widest lg:p-0"
                      field={link}
                    >
                      {label}
                    </PrismicNextLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
      <ul className="hidden flex-col font-medium uppercase tracking-widest xl:flex xl:w-auto xl:flex-row xl:space-x-6 2xl:space-x-8">
        {meta.data.navigation.map(({ link, label, custom_action }) => (
          <li key={label}>
            {custom_action && custom_action === 'open_drawer' ? (
              <button
                data-collapse-toggle="drawer-navigation"
                onClick={() => setOpenDrawer(!openDrawer)}
                type="button"
                className="block py-2 pl-3 pr-4 font-medium uppercase tracking-widest lg:border-0 lg:p-0"
              >
                {label}
              </button>
            ) : (
              <PrismicNextLink className="block py-2 pl-3 pr-4 lg:border-0 lg:p-0" field={link}>
                {label}
              </PrismicNextLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
