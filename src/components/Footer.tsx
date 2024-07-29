import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

import { createClient } from '@/prismicio';

export default async function Footer() {
  const client = createClient();

  const footer = await client.getSingle('footer');

  return (
    <footer className="bg-white">
      <div className="w-full">
        <p className="bg-black p-1 px-4 text-center text-white">{footer.data.protected_brand}</p>
        <div className="mx-auto hidden max-w-screen-2xl px-4 pt-4 md:pt-8 lg:flex lg:items-center lg:justify-between">
          <ul className="my-6 grid w-full grid-cols-2 items-center gap-y-4 font-black uppercase sm:mb-0 xl:grid-cols-4">
            {footer.data.navigation.map(({ link, label, logo }) => (
              <li key={label} className="me-4 md:me-6">
                <PrismicNextLink className="me-4 md:me-6" field={link}>
                  {label}
                </PrismicNextLink>
                {logo ? <PrismicNextImage field={logo} /> : null}
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-6 hidden border-2 border-gray-400 sm:mx-auto lg:my-8 lg:block" />
        <div className="mx-auto my-6 max-w-screen-2xl p-4 sm:flex sm:items-center sm:justify-between md:pb-8 lg:my-0 lg:pt-0">
          <ul className="flex w-full grid-cols-2 flex-col flex-wrap items-center justify-center justify-between gap-y-4 text-xs font-medium uppercase sm:mb-0 lg:grid xl:grid-cols-4">
            <li key="copyright" className="me-0 hidden md:me-6 lg:block">
              {footer.data.copyright}
            </li>
            {footer.data.general_links.map(({ link, label }) => (
              <li key={label} className="me-0 md:me-6">
                <PrismicNextLink className="me-0 md:me-6" field={link}>
                  {label}
                </PrismicNextLink>
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-6 block border-2 border-gray-400 sm:mx-auto lg:my-8 lg:hidden" />
        <p className="block items-center pb-6 text-center font-avenir text-xs font-medium uppercase lg:hidden">
          {footer.data.copyright}
        </p>
      </div>
    </footer>
  );
}
