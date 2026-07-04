const ALLOWED_TAGS = new Set([
  "P",
  "BR",
  "H1",
  "H2",
  "H3",
  "H4",
  "STRONG",
  "B",
  "EM",
  "I",
  "U",
  "A",
  "UL",
  "OL",
  "LI",
  "BLOCKQUOTE",
  "CODE",
  "PRE",
  "HR",
]);

const FORBIDDEN_TAGS = new Set([
  "SCRIPT",
  "STYLE",
  "META",
  "LINK",
  "IFRAME",
  "OBJECT",
  "EMBED",
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function removeEmptyListItems(root: ParentNode) {
  for (const item of Array.from(root.querySelectorAll("li"))) {
    if (!htmlToVisibleText(item.innerHTML)) item.remove();
  }

  for (const list of Array.from(root.querySelectorAll("ul, ol"))) {
    if (!list.querySelector("li")) list.remove();
  }
}

export function plainTextToHtml(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>") || "<br>"}</p>`)
    .join("");
}

export function htmlToVisibleText(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") {
    return html
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent ?? "").replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

export function sanitizeBlogContentHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") return html;

  const doc = new DOMParser().parseFromString(html, "text/html");
  const all: Element[] = [];
  const stack: Element[] = [doc.body];

  while (stack.length) {
    const element = stack.pop()!;
    for (const child of Array.from(element.children)) {
      all.push(child);
      stack.push(child);
    }
  }

  for (let i = all.length - 1; i >= 0; i--) {
    const element = all[i];
    const tag = element.tagName;

    if (FORBIDDEN_TAGS.has(tag)) {
      element.remove();
      continue;
    }

    for (const attr of Array.from(element.attributes)) {
      const isSafeHref =
        tag === "A" &&
        attr.name.toLowerCase() === "href" &&
        /^(https?:|mailto:|tel:|#|\/)/i.test(attr.value.trim());

      if (isSafeHref) continue;
      element.removeAttribute(attr.name);
    }

    if (!ALLOWED_TAGS.has(tag)) {
      const parent = element.parentNode;
      if (!parent) continue;
      while (element.firstChild) parent.insertBefore(element.firstChild, element);
      parent.removeChild(element);
    }
  }

  let output = doc.body.innerHTML.trim();
  output = output.replace(/<p>(?:\s|&nbsp;|<br\s*\/?\s*>)*<\/p>/gi, "");
  removeEmptyListItems(doc.body);
  output = doc.body.innerHTML.trim();
  output = output.replace(/<p>(?:\s|&nbsp;|<br\s*\/?\s*>)*<\/p>/gi, "");
  output = output.replace(/\n{3,}/g, "\n\n");

  return output;
}