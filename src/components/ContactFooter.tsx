import SectionTitle from '@/components/SectionTitle';
import { createClient } from '@/prismicio';

import Button from './Button';
import Divider from './Divider';

export default async function ContactFooter() {
  const client = createClient();

  const footer = await client.getSingle('contact_footer');

  return (
    <section className="bg-[#F7F4EF] p-12 font-avenir tracking-widest md:p-20 xl:p-32">
      <div className="grid">
        <SectionTitle text={footer.data.title} bold={true} centered={true} />
        <Divider centered={true} />
        <p className="text-center text-sm font-medium tracking-widest text-[#9A9A9A] md:text-base">
          {footer.data.description}
        </p>
        <Button link={footer.data.link} label={footer.data.label} />
      </div>
    </section>
  );
}
