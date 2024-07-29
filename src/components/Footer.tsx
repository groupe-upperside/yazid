import { createClient } from '@/prismicio';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';

export default async function Footer() {
  const client = createClient();

  const footer = await client.getSingle('footer');

  return (
    <footer className="bg-white">
      <div className="w-full">
        <p className="bg-black text-white text-center p-1 px-4">{footer.data.protected_brand}</p>
        <div className="hidden lg:flex lg:items-center lg:justify-between max-w-screen-2xl mx-auto pt-4 md:pt-8 px-4">
          <ul className="grid xl:grid-cols-4 grid-cols-2 w-full uppercase font-black items-center mt-6 mb-6 gap-y-4 sm:mb-0">
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
        <hr className="lg:block hidden my-6 sm:mx-auto border-gray-400 border-2 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between max-w-screen-2xl mx-auto pb-4 md:pb-8 px-4 pt-4 lg:pt-0 my-6 lg:my-0">
          <ul className="flex flex-col justify-center lg:grid grid-cols-2 xl:grid-cols-4 w-full flex-wrap justify-between uppercase font-medium items-center text-xs sm:mb-0 gap-y-4">
            <li key="copyright" className="me-0 md:me-6 lg:block hidden">
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
        <hr className="lg:hidden block my-6 sm:mx-auto border-gray-400 border-2 lg:my-8" />
        <p className="block lg:hidden uppercase font-medium items-center text-center font-medium font-avenir text-xs pb-6">
          {footer.data.copyright}
        </p>
      </div>
    </footer>
  );
}
