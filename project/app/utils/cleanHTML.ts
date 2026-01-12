export function cleanHtml(html: string) {
    return html.replace(/&nbsp;/g, " ").replace(/<p><br><\/p>/g, "");
  }