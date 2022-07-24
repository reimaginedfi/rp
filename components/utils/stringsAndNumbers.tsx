export const trimAddress = (address: string, secondSlice: number) =>
  address?.slice(0, 6) + "..." + address?.slice(secondSlice);

export function truncate(str: string, maxDecimalDigits: number)  {
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}