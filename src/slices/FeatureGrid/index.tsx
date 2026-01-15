import type { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import type { SliceComponentProps } from '@prismicio/react';
import { PrismicRichText } from '@prismicio/react';

export type FeatureGridProps = SliceComponentProps<Content.FeatureGridSlice>;

const CopyBlock = ({ text }: { text: Content.FeatureGridSliceDefaultPrimaryFeatureItem['text'] }) => {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-10 md:px-10">
      <div className="space-y-4 text-justify text-sm tracking-widest text-[#707070] md:text-base">
        <PrismicRichText
          field={text}
          components={{
            heading1: ({ children }) => (
              <h2 className="text-2xl font-semibold tracking-tight text-white/85">{children}</h2>
            ),
            heading2: ({ children }) => (
              <h3 className="text-xl font-semibold tracking-tight text-white/85">{children}</h3>
            ),
            heading3: ({ children }) => (
              <h4 className="text-base font-semibold tracking-wide text-white/85">{children}</h4>
            ),
            paragraph: ({ children }) => <p>{children}</p>,
            preformatted: ({ children }) => (
              <pre className="text-xs whitespace-pre-wrap rounded-lg bg-white/5 p-4 text-white/70">{children}</pre>
            ),
            strong: ({ children }) => <strong className="font-semibold text-white/75">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            hyperlink: ({ children }) => (
              <span className="underline decoration-white/30 underline-offset-4 hover:decoration-white/60">
                {children}
              </span>
            ),
          }}
        />
      </div>
    </div>
  );
};

const PlateImage = ({ image }: { image: Content.FeatureGridSliceDefaultPrimaryFeatureItem['image'] }) => {
  if (!image || !('url' in image) || !image.url) return null;

  return (
    <div className="flex h-full items-center justify-center px-6 py-10 md:px-10">
      <div className="relative w-full max-w-[520px]">
        <div className="relative aspect-[4/3] w-full">
          <PrismicNextImage field={image} fill className="object-contain" sizes="(min-width: 768px) 520px, 92vw" />
        </div>
      </div>
    </div>
  );
};

const FeatureGrid = ({ slice }: FeatureGridProps): JSX.Element => {
  const features = slice.primary.feature ?? [];

  return (
    <section className="bg-white" data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className="mx-auto max-w-6xl">
        <div className="space-y-0">
          {features.map((f, idx) => {
            const imageLeft = f.image_left !== false;

            return (
              <div key={`feature-${idx}`} className="grid grid-cols-1 md:grid-cols-2">
                <div className={['order-1', imageLeft ? 'md:order-1' : 'md:order-2'].join(' ')}>
                  <PlateImage image={f.image} />
                </div>

                <div className={['order-2', imageLeft ? 'md:order-2' : 'md:order-1'].join(' ')}>
                  <CopyBlock text={f.text} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
