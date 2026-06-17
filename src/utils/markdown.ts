export function parseInlineMarkdown(text: string): string {
  if (!text) return "";
  
  const urls: string[] = [];
  let html = text.replace(/(?<!\!)\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    urls.push(url);
    // Protect URL with @@URL_x@@
    return `[${label}](@@URL_${urls.length - 1}@@)`;
  });

  html = html
    // 1. Bold: **Text** (Do not process \*\* case)
    .replace(/(?<!\\)\*\*(?!\s)(.*?)(?<!\s)(?<!\\)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\\)(?<!\w)__(?!\s)(.*?)(?<!\s)(?<!\\)__(?!\w)/g, "<strong>$1</strong>")
    
    // 2. Italic: *Text* (Do not provess \* case)
    .replace(/(?<!\\)\*(?!\s)(.*?)(?<!\s)(?<!\\)\*/g, "<em>$1</em>")
    .replace(/(?<!\\)(?<!\w)_(?!\s)(.*?)(?<!\s)(?<!\\)_(?!\w)/g, "<em>$1</em>")
    
    // 3. Hyperlink: [Text](URL), including mailto and target="_blank"
    .replace(/\[([^\]]+)\]\(@@URL_(\d+)@@\)/g, (match, label, index) => {
      return `<a href="${urls[Number(index)]}" target="_blank" rel="noreferrer">${label}</a>`;
    })
    
    // 4. After formmating, remove the escape sign '\' and restore normal * and _ 
    // In Markdown file, write \\* and \\_ will show an * and _ sign)
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_");

    return html;
}

export function parseFullMarkdown(markdown: string): string {
  if (!markdown) return "";
  
  const blocks = markdown.trim().split(/\n{2,}/);

  return blocks.map((block) => {
    const lines = block.split("\n");
    
    // Process list
    if (lines.every((line) => line.trim().match(/^[-*]\s/))) {
      return `<ul>${lines.map((line) => `<li>${parseInlineMarkdown(line.replace(/^[-*]\s/, ""))}</li>`).join("")}</ul>`;
    }
    // Process title
    if (block.startsWith("### ")) {
      return `<h3>${parseInlineMarkdown(block.slice(4))}</h3>`;
    }
    if (block.startsWith("#### ")) {
      return `<h4>${parseInlineMarkdown(block.slice(5))}</h4>`;
    }
    // Process paragraph
    return `<p>${parseInlineMarkdown(block.replace(/\n/g, " "))}</p>`;
  }).join("");
}

export function stripMarkdown(text: string): string {
  if (!text) return "";
  
  return text
    // 1. Covert hyperlinks to pure text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // 2. Remove bold and italic * and _ signs
    .replace(/(?<!\\)[*_]{1,2}/g, "")
    // 3. Restore escaped symbols with \\
    .replace(/\\([*_])/g, "$1");
}
