export default function getRequestDuration(time?: string | string[] | number) {
  if (time == null) {
    return -1;
  }

  if (typeof time === 'number') {
    return time;
  }

  if (Array.isArray(time)) {
    const head = time.at(0);

    if (head == null) {
      return -1;
    }

    const parsed = Number.parseInt(head, 10);
    return Number.isNaN(parsed) ? -1 : parsed;
  }

  const parsed = Number.parseInt(time, 10);
  return Number.isNaN(parsed) ? -1 : parsed;
}
