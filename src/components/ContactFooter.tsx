import { createClient } from '@/prismicio';

import Button from './Button';
import Divider from './Divider';

export default async function ContactFooter() {
  const client = createClient();

  const footer = await client.getSingle('contact_footer');

  return (
    <section className="bg-[#F7F4EF] p-20 font-avenir tracking-widest xl:p-32">
      <div className="grid">
        <h2 className="text-center text-2xl font-semibold uppercase text-gray-900 md:text-3xl">{footer.data.title}</h2>
        <Divider centered={true} />
        <p className="text-center text-lg font-medium tracking-widest text-[#9A9A9A]">{footer.data.description}</p>
        <Button link={footer.data.link} label={footer.data.label} />
      </div>
    </section>
  );
}
