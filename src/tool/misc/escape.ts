export default function escape(data: string, replace?: string): string {
  return data.replace(
    /([\f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff])/g,
    replace ?? '\\$1',
  );
}
