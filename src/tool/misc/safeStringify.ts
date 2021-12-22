export default function safeStringify<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '';
  }
}
