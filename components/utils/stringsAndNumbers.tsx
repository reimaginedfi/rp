export const trimAddress = (address: string, firstSlice: number, secondSlice: number) =>
  address?.slice(0, firstSlice) + "..." + address?.slice(secondSlice);

export function truncate(str: string, maxDecimalDigits: number)  {
  if (str.includes(".")) {
    const parts = str.split(".");
    return parts[0] + "." + parts[1].slice(0, maxDecimalDigits);
  }
  return str;
}

export const noSpecialCharacters = (str: string) => {
  return str.replace(/[^0-9.]/g, '');
}