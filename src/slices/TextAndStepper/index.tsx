import type { Content } from '@prismicio/client';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

import Divider from '@/components/Divider';
import SectionTitle from '@/components/SectionTitle';

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
      className="p-12 font-avenir tracking-widest md:p-20 xl:p-32"
    >
      <div className="me-auto place-self-center xl:col-span-7">
        <SectionTitle text={slice.primary.title_light} centered={true} />
        <SectionTitle text={slice.primary.title_bold} bold={true} centered={true} />
        <Divider centered={true} />
        <div className="mx-auto w-full space-y-6">
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => (
                <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
              ),
            }}
          />
        </div>
      </div>
      <div className="pt-16 xl:pt-24">
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-y-6 md:w-3/4">
          {slice.primary.stepper.map((stepper, index) => (
            <div className="group w-full" key={index}>
              <div className="w-full cursor-pointer bg-black p-6 text-center text-base uppercase tracking-widest text-white md:text-lg">
                {stepper.step_title}
              </div>
              <div className="hidden p-12 group-hover:block">
                <PrismicRichText
                  field={stepper.step_description}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="text-justify text-sm tracking-widest text-[#707070] md:text-base">{children}</p>
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
