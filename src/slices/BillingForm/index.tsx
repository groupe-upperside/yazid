'use client';

import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import SectionTitle from '@/components/SectionTitle';

/**
 * Props for `BillingForm`.
 */
export type BillingFormProps = SliceComponentProps<Content.BillingFormSlice>;

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
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  phone: string;
  city: string;
  postalCode: string;
  country: string;
}

/**
 * Component for "BillingForm" Slices.
 */
const BillingForm = ({ slice }: BillingFormProps): JSX.Element => {
  const [formValues, setFormValues] = useState<FormValuesProps>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    city: '',
    postalCode: '',
    country: 'FR',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  function openPayment() {
    window.location.hash = '#/checkout';
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!window.Snipcart?.store) {
      toast.error('Le module de paiement n’est pas prêt.');
      return;
    }

    try {
      const missing = slice.primary.form_field.filter((f) => {
        if (!f.required) return false;
        const v = formValues[f.field_name];
        return f.field_type === 'checkbox' ? !v : (v as string).trim() === '';
      });

      if (missing.length) {
        toast.error('Merci de remplir tous les champs obligatoires.');
        return;
      }

      const state = window.Snipcart.store.getState();

      if (!state.cart.items.items?.length) {
        toast.error('Votre panier est vide.');
        return;
      }

      const custom = state.cart.customFields || [];
      const dateField = custom.find((c) => c.name === 'Date de retrait');
      const slotField = custom.find((c) => c.name === 'Créneau horaire');

      if (!dateField || !slotField) {
        toast.error('Merci de sélectionner le jour et le créneau horaire de retrait.');
        return;
      }

      console.log(state.cart);

      await window.Snipcart.api.cart.update({
        email: formValues.email,
        billingAddress: {
          name: formValues.lastName,
          firstName: formValues.firstName,
          fullName: `${formValues.firstName} ${formValues.lastName}`,
          address1: formValues.address1,
          city: formValues.city,
          postalCode: formValues.postalCode,
          country: formValues.country,
          phone: formValues.phone,
        },
        customFields: custom,
      });

      openPayment();
    } catch (err) {
      console.error('flow.start failed:', err);
      toast.error('Erreur lors de l’ouverture du paiement.');
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="mx-auto w-full bg-[#F7F4EF] font-avenir tracking-widest lg:w-1/2"
    >
      <SectionTitle text={slice.primary.title_bold} bold={true} centered={false} />
      <form className="pt-6" onSubmit={handleSubmit}>
        {slice.primary.form_field.map((item, index) => {
          const fieldName = item.field_name as keyof FormValuesProps;
          return (
            <div
              key={index}
              className={`mb-5 w-full ${item.field_type === 'checkbox' ? 'flex flex-row-reverse gap-x-4' : 'block'}`}
            >
              {item.field_type === 'long text' && (
                <textarea
                  onChange={handleChange}
                  name={item.field_name as string}
                  className="peer mt-8 block min-h-36 w-full appearance-none border-2 border-gray-300 bg-transparent px-0 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0"
                  required={item.required}
                  value={formValues[fieldName]}
                />
              )}
              {item.field_type !== 'long text' && (
                <>
                  <input
                    type={returnInputType(item)}
                    onChange={handleChange}
                    name={item.field_name as string}
                    className={`${item.field_type === 'checkbox' ? 'border-2 border-gray-300 accent-black' : 'peer block w-full appearance-none bg-white p-2.5 text-sm text-gray-900 focus:outline-none focus:ring-0'}`}
                    required={item.required}
                    placeholder={item.label as string}
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

export default BillingForm;
