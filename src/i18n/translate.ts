import { messages, type MessageKey } from "./messages";
import type { Locale } from "./locale";
export function translate(locale: Locale, key: MessageKey, values: Record<string, string | number> = {}): string {
  return messages[key][locale].replace(/\{(\w+)\}/g, (match, name: string) => name in values ? String(values[name]) : match);
}
