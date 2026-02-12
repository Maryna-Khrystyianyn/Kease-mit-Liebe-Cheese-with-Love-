export function stripHtml(html: string) {
  if (!html) return "";

  return html
    .replace(/&nbsp;/g, " ")
    .replace(/<\s*\/?p\s*>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+\n/g, "\n")
    .trim();
}

export function textToHtml(text: string) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => `<p>${line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
    .join("");
}
