import type { KeyTextField, LinkField } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';

interface ButtonProps {
  link: LinkField | null | undefined;
  label: KeyTextField | null | undefined;
  dark?: boolean;
  link2_zenchef?: boolean;
}

export default function Button({ link, label, dark = true, link2_zenchef = false }: ButtonProps) {
  return link2_zenchef ? (
    <button
      className={`mx-auto mt-8 ${dark ? 'bg-black text-white' : 'border border-black bg-white'} px-8 py-4 text-center text-sm font-medium uppercase  2xl:px-12`}
      data-zc-action="open"
    >
      {label}
    </button>
  ) : (
    <div className="flex w-full justify-center">
      <PrismicNextLink
        className={`mx-auto mt-8 ${dark ? 'bg-black text-white' : 'border border-black bg-white'} px-8 py-4 text-center text-sm font-medium uppercase  2xl:px-12`}
        field={link}
      >
        {label}
      </PrismicNextLink>
    </div>
  );
}
