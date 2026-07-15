import { marked } from "marked";

export const PROSE_CLASS =
  "[&>*+*]:mt-3 [&_a]:underline [&_a]:text-neutral-100 [&_h1]:text-sm [&_h2]:text-sm [&_h1]:mt-4 [&_h2]:mt-4 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-black/40 [&_code]:px-1";

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}
