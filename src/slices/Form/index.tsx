import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import SectionTitle from '@/components/SectionTitle';

import type { Simplify } from '../../../prismicio-types';

/**
 * Props for `Form`.
 */
export type FormProps = SliceComponentProps<Content.FormSlice>;

const ReturnInput = (item: Simplify<Content.FormSliceDefaultPrimaryFormFieldItem>) => {
  const TextInput = () => {
    return (
      <input
        type="text"
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
        required={item.required}
      />
    );
  };

  const EmailInput = () => {
    return (
      <input
        type="email"
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
        required={item.required}
      />
    );
  };

  const LongTextInput = () => {
    return (
      <textarea
        className="peer mt-8 block min-h-36 w-full appearance-none border-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
        required={item.required}
      />
    );
  };

  const CheckboxInput = () => {
    return <input type="checkbox" className="border-2 border-gray-300 accent-black" required={item.required} />;
  };

  const TelInput = () => {
    return (
      <input
        type="tel"
        className="peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
        required={item.required}
      />
    );
  };

  switch (item.field_type) {
    case 'text':
      return <TextInput />;
    case 'email':
      return <EmailInput />;
    case 'long text':
      return <LongTextInput />;
    case 'phone':
      return <TelInput />;
    case 'checkbox':
      return <CheckboxInput />;
    default:
      return <TextInput />;
  }
};

/**
 * Component for "Form" Slices.
 */
const Form = ({ slice }: FormProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto w-full bg-white p-12 font-avenir tracking-widest md:p-20 lg:w-3/4 xl:w-2/3 xl:p-32 2xl:w-1/2"
    >
      <SectionTitle text={slice.primary.title} bold={true} centered={true} />
      <div className="flex flex-col items-center justify-center space-y-2 py-16 xl:py-20">
        <PrismicRichText
          field={slice.primary.description}
          components={{
            paragraph: ({ children }) => <p className="text-center tracking-widest text-[#707070]">{children}</p>,
            list: ({ children }) => (
              <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
            ),
          }}
        />
      </div>
      <form className="">
        {slice.primary.form_field.map((item, index) => (
          <div
            key={index}
            className={`mb-5 w-full ${item.field_type === 'checkbox' ? 'flex flex-row-reverse gap-x-4' : 'block'}`}
          >
            {isFilled.link(item.link_to_pdf) ? (
              <PrismicNextLink field={item.link_to_pdf} className="text-xs text-[#707070] underline">
                <label className="peer block w-full appearance-none bg-transparent p-0 text-sm text-[#999999] focus:outline-none focus:ring-0">
                  {item.label}
                  {item.required ? <sup className="pl-0.5 font-bold text-red-500">*</sup> : null}
                </label>
                {ReturnInput(item)}
              </PrismicNextLink>
            ) : (
              <>
                <label className="peer block w-full appearance-none bg-transparent p-0 text-sm text-[#999999] focus:outline-none focus:ring-0">
                  {item.label}
                  {item.required ? <sup className="pl-0.5 font-bold text-red-500">*</sup> : null}
                </label>
                {ReturnInput(item)}{' '}
              </>
            )}
          </div>
        ))}
        <div className="flex w-full justify-center">
          <button className="text-xs mx-auto mt-8 bg-black px-12 py-4 text-center font-medium uppercase text-white">
            {slice.primary.submit_button_label}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
