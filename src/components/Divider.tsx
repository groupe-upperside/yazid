export default function Divider({ centered = false }) {
  return (
    <hr
      className={`border-0.5 mb-10 mt-6 h-0.5 w-28 border-black ${centered ? 'mx-auto flex' : 'mx-auto flex xl:mx-0 xl:block'}`}
    />
  );
}
