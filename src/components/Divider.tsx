export default function Divider({ centered = false }) {
  return (
    <hr
      className={`mt-6 mb-10 w-28 border-black h-0.5 border-0.5 ${centered ? 'mx-auto flex' : 'xl:mx-0 mx-auto flex xl:block'}`}
    />
  );
}
