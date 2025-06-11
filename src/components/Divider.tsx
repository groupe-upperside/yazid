export default function Divider({ centered = false, borderColor = 'border-black' }) {
  return (
    <hr
      className={`border-0.5 mb-10 mt-6 h-0.5 w-28 ${borderColor} ${centered ? 'mx-auto flex' : 'mx-auto flex xl:mx-0 xl:block'}`}
    />
  );
}
