export const formatToString = (v: string) => {
  const n = parseFloat(v);
  if (Number.isNaN(n)) return '0.00';
  return n.toFixed(2);
};
