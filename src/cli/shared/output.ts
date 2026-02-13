/* eslint-disable no-console */
export function printJson(prefix: string, value: unknown): void {
  console.log(`${prefix}:`, JSON.stringify(value, null, 2));
}

export function printLine(value: string): void {
  console.log(value);
}

export function printSection(title: string): void {
  console.log(`\n${title}\n`);
}
