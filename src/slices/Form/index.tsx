'use client';

import type { Content } from '@prismicio/client';
import { isFilled } from '@prismicio/client';
import { PrismicNextLink } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { sendEmail } from '@/app/lib/actions/sendEmail/action';
import SectionTitle from '@/components/SectionTitle';

/**
 * Props for `Form`.
 */
export type FormProps = SliceComponentProps<Content.FormSlice>;

const returnInputType = (item: any) => {
  switch (item.field_type) {
    case 'email':
      return 'email';
    case 'phone':
      return 'tel';
    case 'checkbox':
      return 'checkbox';
    default:
      return 'text';
  }
};

interface FormValuesProps {
  name: string;
  subject: string;
  message: string;
  indicatif: string;
  phone: string;
  email: string;
}

/**
 * Component for "Form" Slices.
 */
const Form = ({ slice }: FormProps): JSX.Element => {
  const [formValues, setFormValues] = useState<FormValuesProps>({
    name: '',
    subject: '',
    message: '',
    indicatif: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailData = {
      receiver: 'direction@yigestion.com',
      templateId: '6182504',
      subject: formValues.subject,
      variables: { ...formValues },
    };
    try {
      await sendEmail(emailData);
      toast.success(slice.primary.success_message);
    } catch (error) {
      console.error(error);
      toast.error(slice.primary.error_message);
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto w-full bg-white p-6 font-avenir tracking-widest md:p-20 lg:w-3/4 xl:w-2/3 xl:p-32 2xl:w-1/2"
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
      <form onSubmit={handleSubmit}>
        {slice.primary.form_field.map((item, index) => {
          const fieldName = item.field_name as keyof FormValuesProps;
          return (
            <div
              key={index}
              className={`mb-5 w-full ${item.field_type === 'checkbox' ? 'flex flex-row-reverse gap-x-4' : 'block'}`}
            >
              {isFilled.link(item.link_to_pdf) && (
                <PrismicNextLink
                  target="_blank"
                  field={item.link_to_pdf}
                  className="text-xs flex w-full cursor-pointer flex-row-reverse justify-end gap-x-4 text-[#707070] underline"
                >
                  <label className="peer block appearance-none bg-transparent p-0 text-sm text-[#999999] focus:outline-none focus:ring-0">
                    {item.label}
                    {item.required && <sup className="pl-0.5 font-bold text-red-500">*</sup>}
                  </label>
                  <input
                    type={returnInputType(item)}
                    onChange={handleChange}
                    name={item.field_name as string}
                    className={`${item.field_type === 'checkbox' ? 'border-2 border-gray-300 accent-black' : 'peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0'}`}
                    required={item.required}
                    value={formValues[fieldName]}
                  />
                </PrismicNextLink>
              )}
              {!isFilled.link(item.link_to_pdf) && item.field_type === 'long text' && (
                <textarea
                  onChange={handleChange}
                  name={item.field_name as string}
                  className="peer mt-8 block min-h-36 w-full appearance-none border-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
                  required={item.required}
                  value={formValues[fieldName]}
                />
              )}
              {!isFilled.link(item.link_to_pdf) && item.field_type !== 'long text' && (
                <>
                  <label className="peer block w-full appearance-none bg-transparent p-0 text-sm text-[#999999] focus:outline-none focus:ring-0">
                    {item.label}
                    {item.required && <sup className="pl-0.5 font-bold text-red-500">*</sup>}
                  </label>
                  <input
                    type={returnInputType(item)}
                    onChange={handleChange}
                    name={item.field_name as string}
                    className={`${item.field_type === 'checkbox' ? 'border-2 border-gray-300 accent-black' : 'peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0'}`}
                    required={item.required}
                    value={formValues[fieldName]}
                  />
                </>
              )}
            </div>
          );
        })}
        <div className="flex w-full justify-center">
          <button
            type="submit"
            className="mx-auto mt-8 bg-black px-8 py-4 text-center text-sm font-medium uppercase text-white 2xl:px-12"
          >
            {slice.primary.submit_button_label}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
