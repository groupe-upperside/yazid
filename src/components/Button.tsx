import type { KeyTextField, LinkField } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';

interface ButtonProps {
  link: LinkField | null | undefined;
  label: KeyTextField | null | undefined;
}

export default function Button({ link, label }: ButtonProps) {
  return (
    <div className="flex w-full justify-center">
      <PrismicNextLink
        className="mx-auto mt-8 bg-black px-12 py-4 text-center text-xs font-medium uppercase text-white"
        field={link}
      >
        {label}
      </PrismicNextLink>
    </div>
  );
}
