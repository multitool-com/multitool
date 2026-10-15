/**
 * Minimal XML reader for OOXML documents.
 *
 * Word files (.docx) are ZIP archives full of XML. The browser ships a DOM
 * parser, but the conversion engine is also exercised in plain Node (tests,
 * CLI checks), so it carries its own tiny parser instead of depending on
 * `DOMParser` or pulling a library.
 *
 * It supports exactly what OOXML uses: elements, attributes (single and double
 * quoted), self-closing tags, comments, CDATA, processing instructions and
 * numeric/named entities. Namespace prefixes are kept in `name`, and callers
 * compare with `localName()` so `w:p`, `ns0:p` and `x:p` are all paragraphs.
 */

export interface XmlNode {
  name: string;
  attrs: Record<string, string>;
  children: XmlNode[];
  /** Direct text content of this element (children's text is not included). */
  text: string;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, body: string) => {
    if (body.startsWith("#x") || body.startsWith("#X")) {
      const code = Number.parseInt(body.slice(2), 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    if (body.startsWith("#")) {
      const code = Number.parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return ENTITIES[body.toLowerCase()] ?? match;
  });
}

/** Element name without its namespace prefix. */
export function localName(name: string): string {
  const index = name.indexOf(":");
  return index === -1 ? name : name.slice(index + 1);
}

/** Parses an XML string into a tree. Never throws: malformed markup is skipped. */
export function parseXml(xml: string): XmlNode {
  const root: XmlNode = { name: "#document", attrs: {}, children: [], text: "" };
  const stack: XmlNode[] = [root];
  let i = 0;

  while (i < xml.length) {
    const lt = xml.indexOf("<", i);
    if (lt === -1) break;

    if (lt > i) {
      const text = xml.slice(i, lt);
      if (text.trim()) stack[stack.length - 1].text += decodeEntities(text);
      i = lt;
    }

    // <!-- comment -->, <![CDATA[ ... ]]>, <?xml ... ?>, <!DOCTYPE ...>
    if (xml.startsWith("<!--", i)) {
      const end = xml.indexOf("-->", i);
      i = end === -1 ? xml.length : end + 3;
      continue;
    }
    if (xml.startsWith("<![CDATA[", i)) {
      const end = xml.indexOf("]]>", i);
      const content = xml.slice(i + 9, end === -1 ? xml.length : end);
      stack[stack.length - 1].text += content;
      i = end === -1 ? xml.length : end + 3;
      continue;
    }
    if (xml.startsWith("<?", i)) {
      const end = xml.indexOf("?>", i);
      i = end === -1 ? xml.length : end + 2;
      continue;
    }
    if (xml.startsWith("<!", i)) {
      const end = xml.indexOf(">", i);
      i = end === -1 ? xml.length : end + 1;
      continue;
    }

    const gt = xml.indexOf(">", i);
    if (gt === -1) break;
    const rawTag = xml.slice(i + 1, gt);
    i = gt + 1;

    if (rawTag.startsWith("/")) {
      if (stack.length > 1) stack.pop();
      continue;
    }

    const selfClosing = rawTag.endsWith("/");
    const body = selfClosing ? rawTag.slice(0, -1) : rawTag;

    // name + attributes
    const spaceMatch = /[\s/]/.exec(body);
    const name = spaceMatch ? body.slice(0, spaceMatch.index) : body;
    const attrs: Record<string, string> = {};
    const attrSource = spaceMatch ? body.slice(spaceMatch.index) : "";
    const attrRe = /([^\s=/]+)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
    let match: RegExpExecArray | null;
    while ((match = attrRe.exec(attrSource)) !== null) {
      const key = match[1];
      const value = match[3] ?? match[4] ?? match[5] ?? "";
      attrs[key] = decodeEntities(value);
    }

    const node: XmlNode = { name, attrs, children: [], text: "" };
    stack[stack.length - 1].children.push(node);
    if (!selfClosing) stack.push(node);
  }

  return root;
}

/* ------------------------------------------------------------------ */
/* Small helpers used all over the Word reader                         */
/* ------------------------------------------------------------------ */

export function childrenNamed(node: XmlNode, name: string): XmlNode[] {
  const out: XmlNode[] = [];
  for (const child of node.children) {
    if (localName(child.name) === name) out.push(child);
  }
  return out;
}

export function firstChildNamed(node: XmlNode, name: string): XmlNode | null {
  for (const child of node.children) {
    if (localName(child.name) === name) return child;
  }
  return null;
}

/** Depth-first search for the first descendant with this local name. */
export function findFirst(node: XmlNode, name: string): XmlNode | null {
  for (const child of node.children) {
    if (localName(child.name) === name) return child;
    const deeper = findFirst(child, name);
    if (deeper) return deeper;
  }
  return null;
}

export function findAll(node: XmlNode, name: string): XmlNode[] {
  const out: XmlNode[] = [];
  for (const child of node.children) {
    if (localName(child.name) === name) out.push(child);
    out.push(...findAll(child, name));
  }
  return out;
}

/**
 * Attribute lookup that ignores the namespace prefix: OOXML writes the
 * relationship id as `r:embed`, `r:id` or `id` depending on the producer.
 */
export function attrLocal(node: XmlNode, name: string): string | null {
  if (node.attrs[name] !== undefined) return node.attrs[name];
  for (const key of Object.keys(node.attrs)) {
    if (localName(key) === name) return node.attrs[key];
  }
  return null;
}

/** `w:val="false" | "0" | "off"` counts as false, anything else as true. */
export function valIsOn(node: XmlNode | null): boolean {
  if (!node) return false;
  const value = attrLocal(node, "val");
  if (value === null) return true;
  return !["0", "false", "off", "none"].includes(value.toLowerCase());
}
