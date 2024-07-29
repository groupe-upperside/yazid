import { KeyTextField, LinkField } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';

interface ButtonProps {
  link: LinkField | null | undefined;
  label: KeyTextField | null | undefined;
}

export default function Button({ link, label }: ButtonProps) {
  return (
    <div className="w-full flex justify-center">
      <PrismicNextLink
        className="mx-auto text-xs uppercase text-center mt-8 px-12 py-4 font-medium text-white bg-black"
        field={link}
      >
        {label}
      </PrismicNextLink>
    </div>
  );
}
