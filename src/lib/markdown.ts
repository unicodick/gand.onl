import { marked } from "marked";

export const PROSE_CLASS =
  "[&>*+*]:mt-3 [&_a]:underline [&_a]:text-neutral-100 [&_h1]:text-sm [&_h2]:text-sm [&_h1]:mt-4 [&_h2]:mt-4 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_code]:bg-black/40 [&_code]:px-1";

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
}

export function excerpt(markdown: string, length = 160): string {
  const text = markdown
    .replace(/[#>*_`~[\]]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
