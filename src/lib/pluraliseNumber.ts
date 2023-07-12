export default function pluraliseNumber(
  number: number,
  singular: string,
  plural: string
) {
  return number === 1 ? singular : plural
}
