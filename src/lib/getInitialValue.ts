export default function getInitialValue(
  path: string,
  obj: any,
  separator = '.',
) {
  const properties = Array.isArray(path)
    ? path
    : (path.split(separator) as any);
  return properties.reduce((prev: any, curr: any) => prev?.[curr], obj);
}
