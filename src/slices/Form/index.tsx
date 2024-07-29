import { Content, isFilled } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';

/**
 * Props for `Form`.
 */
export type FormProps = SliceComponentProps<Content.FormSlice>;

const ReturnInput = (item) => {
  const TextInput = () => {
    return (
      <input
        type="text"
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
        required={item.required}
      />
    );
  };

  const EmailInput = () => {
    return (
      <input
        type="email"
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
        required={item.required}
      />
    );
  };

  const LongTextInput = () => {
    return (
      <textarea
        className="block py-2.5 px-0 mt-8 w-full text-sm text-gray-900 bg-transparent border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer min-h-36"
        required={item.required}
      />
    );
  };

  const CheckboxInput = () => {
    return <input type="checkbox" className="accent-black border-2 border-gray-300" required={item.required} />;
  };

  const TelInput = () => {
    return (
      <input
        type="tel"
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer"
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
      className="bg-white p-20 xl:p-32 font-avenir tracking-widest w-full lg:w-3/4 xl:w-2/3 2xl:w-1/2 mx-auto"
    >
      <h2 className="text-2xl font-semibold uppercase text-gray-900 md:text-3xl text-center">{slice.primary.title}</h2>
      <div className="space-y-2 flex justify-center items-center flex-col py-16 xl:py-20">
        <PrismicRichText
          field={slice.primary.description}
          components={{
            paragraph: ({ children }) => <p className="text-center tracking-widest text-[#707070]">{children}</p>,
            list: ({ children }) => (
              <ul className="list-disc list-inside tracking-widest text-[#707070]">{children}</ul>
            ),
          }}
        />
      </div>
      <form className="">
        {slice.primary.form_field.map((item, index) => (
          <div
            key={index}
            className={`w-full mb-5 ${item.field_type === 'checkbox' ? 'flex flex-row-reverse gap-x-4' : 'block'}`}
          >
            {isFilled.link(item.link_to_pdf) ? (
              <PrismicNextLink field={item.link_to_pdf} className="text-xs text-[#707070] underline">
                <label className="block p-0 w-full text-sm text-[#999999] bg-transparent appearance-none focus:outline-none focus:ring-0 peer">
                  {item.label}
                  {item.required ? <sup className="pl-0.5 text-red-500 font-bold">*</sup> : null}
                </label>
                {ReturnInput(item)}
              </PrismicNextLink>
            ) : (
              <>
                <label className="block p-0 w-full text-sm text-[#999999] bg-transparent appearance-none focus:outline-none focus:ring-0 peer">
                  {item.label}
                  {item.required ? <sup className="pl-0.5 text-red-500 font-bold">*</sup> : null}
                </label>
                {ReturnInput(item)}{' '}
              </>
            )}
          </div>
        ))}
        <div className="w-full flex justify-center">
          <button className="mx-auto text-xs uppercase text-center mt-8 px-12 py-4 font-medium text-white bg-black">
            {slice.primary.submit_button_label}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
