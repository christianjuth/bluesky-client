export function abbriviateNumber(number: number) {
  if (number < 1000) {
    return number;
  }

  if (number < 1000000) {
    return `${Math.floor(number / 1000)}k`;
  }

  return `${Math.floor(number / 1000000)}m`;
}
