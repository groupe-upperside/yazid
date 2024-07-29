import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Divider from '@/components/Divider';

/**
 * Props for `TextAndStepper`.
 */
export type TextAndStepperProps = SliceComponentProps<Content.TextAndStepperSlice>;

/**
 * Component for "TextAndStepper" Slices.
 */
const TextAndStepper = ({ slice }: TextAndStepperProps): JSX.Element => {
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-white p-20 font-avenir tracking-widest xl:p-32"
    >
      <div className="me-auto place-self-center xl:col-span-7">
        <h2 className="mb-3 text-center text-2xl uppercase text-gray-900 md:text-3xl">
          {slice.primary.title_light}
          <br />
          <span className="font-semibold">{slice.primary.title_bold}</span>
        </h2>
        <Divider centered={true} />
        <div className="mx-auto w-3/4 space-y-6">
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => <p className="text-justify tracking-widest text-[#707070]">{children}</p>,
            }}
          />
        </div>
      </div>
      <div className="pt-16 xl:pt-24">
        <div className="mx-auto flex w-3/4 flex-col items-center justify-center gap-y-6">
          {slice.primary.stepper.map((stepper, index) => (
            <div className="group w-full">
              <div className="w-full cursor-pointer bg-black p-6 text-center text-xl uppercase tracking-widest text-white">
                {stepper.step_title}
              </div>
              <div className="hidden p-12 group-hover:block">
                <PrismicRichText
                  field={stepper.step_description}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="text-justify tracking-widest text-[#707070]">{children}</p>
                    ),
                    list: ({ children }) => (
                      <ul className="list-inside list-disc tracking-widest text-[#707070]">{children}</ul>
                    ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TextAndStepper;
