import { useRef } from 'react';
import { FaRegCalendar } from 'react-icons/fa';

type Props = {
  value: string;
  onChange: (v: string) => void;
  min: string;
  placeholder: string | null;
};

export default function DatePicker({ value, onChange, min, placeholder }: Props) {
  const format = (iso = '') => {
    if (!iso) return placeholder;
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  };

  const dateInputRef = useRef<HTMLInputElement>(null);

  const openCalendar = () => {
    // showPicker() works in Chrome, Edge, and Safari 16+
    dateInputRef.current?.showPicker();
  };

  return (
    <label className="relative inline-block size-full">
      <input
        ref={dateInputRef}
        type="date"
        className="picker size-full opacity-0"
        value={value}
        min={min}
        required
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="align-center flex select-none items-center gap-2 whitespace-nowrap rounded bg-[#111827] px-4 py-2 text-base leading-none text-white">
        <FaRegCalendar onClick={openCalendar} className="size-4 cursor-pointer" />
        <p className="select-none">{format(value)}</p>
      </div>
    </label>
  );
}
