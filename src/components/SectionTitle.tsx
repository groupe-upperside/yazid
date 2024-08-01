import type { KeyTextField } from '@prismicio/client';

interface SectionTitleProps {
  text: KeyTextField;
  bold?: boolean;
  centered?: boolean;
}

const SectionTitle = ({ text, centered = false, bold = false }: SectionTitleProps) => {
  return !bold ? (
    <h2
      className={`mb-3 text-center text-xl font-medium uppercase tracking-widest text-gray-900 md:text-3xl ${centered ? 'xl:text-center' : 'xl:text-start'} xl:text-4xl`}
    >
      {text}
    </h2>
  ) : (
    <h2
      className={`mb-3 text-center text-xl font-semibold uppercase tracking-widest text-gray-900 md:text-3xl ${centered ? 'xl:text-center' : 'xl:text-start'} xl:text-4xl`}
    >
      {text}
    </h2>
  );
};

export default SectionTitle;
