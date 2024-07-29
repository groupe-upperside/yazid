import { Content } from '@prismicio/client';
import { PrismicRichText, SliceComponentProps } from '@prismicio/react';
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
      className="bg-white p-20 xl:p-32 font-avenir tracking-widest"
    >
      <div className="me-auto place-self-center xl:col-span-7">
        <h2 className="mb-3 text-2xl uppercase text-center text-gray-900 md:text-3xl">
          {slice.primary.title_light}
          <br />
          <span className="font-semibold">{slice.primary.title_bold}</span>
        </h2>
        <Divider centered={true} />
        <div className="space-y-6 w-3/4 mx-auto">
          <PrismicRichText
            field={slice.primary.description}
            components={{
              paragraph: ({ children }) => <p className="text-justify tracking-widest text-[#707070]">{children}</p>,
            }}
          />
        </div>
      </div>
      <div className="pt-16 xl:pt-24">
        <div className="flex flex-col justify-center items-center gap-y-6 w-3/4 mx-auto">
          {slice.primary.stepper.map((stepper, index) => (
            <div className="w-full group">
              <div className="bg-black cursor-pointer text-white w-full p-6 uppercase tracking-widest text-center text-xl">
                {stepper.step_title}
              </div>
              <div className="p-12 hidden group-hover:block">
                <PrismicRichText
                  field={stepper.step_description}
                  components={{
                    paragraph: ({ children }) => (
                      <p className="text-justify tracking-widest text-[#707070]">{children}</p>
                    ),
                    list: ({ children }) => (
                      <ul className="list-disc list-inside tracking-widest text-[#707070]">{children}</ul>
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
