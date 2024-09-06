export function abbriviateNumber(number: number) {
  if (number < 1000) {
    return number;
  }

  if (number < 1000000) {
    return `${Math.floor(number / 100) / 10}k`;
  }

  return `${Math.floor(number / 100000) / 10}m`;
}

export function getInitials(name: string) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter((n) => /^[A-Z]/i.test(n))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return initials;
}
