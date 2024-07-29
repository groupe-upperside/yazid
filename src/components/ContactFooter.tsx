import { createClient } from '@/prismicio';
import Divider from './Divider';
import Button from './Button';

export default async function ContactFooter() {
  const client = createClient();

  const footer = await client.getSingle('contact_footer');

  return (
    <section className="bg-[#F7F4EF] p-20 xl:p-32 font-avenir tracking-widest">
      <div className="grid">
        <h2 className="text-2xl font-semibold uppercase text-gray-900 md:text-3xl text-center">{footer.data.title}</h2>
        <Divider centered={true} />
        <p className="text-center text-lg font-medium tracking-widest text-[#9A9A9A]">{footer.data.description}</p>
        <Button link={footer.data.link} label={footer.data.label} />
      </div>
    </section>
  );
}
