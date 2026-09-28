/** Lucide-compatible outline icons (24x24 viewBox, 2px stroke), stored as element tuples. */
export const icons = {
  x: [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }],
  ],
  eye: [
    ["path", { d: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" }],
    ["circle", { cx: "12", cy: "12", r: "3" }],
  ],
  "eye-off": [
    ["path", { d: "m3 3 18 18" }],
    ["path", { d: "M10.6 10.6a2 2 0 0 0 2.8 2.8" }],
    ["path", { d: "M9.9 5.2A11.8 11.8 0 0 1 12 5c6.4 0 10 7 10 7a15.8 15.8 0 0 1-3.1 3.9" }],
    ["path", { d: "M6.6 6.6C3.6 8.4 2 12 2 12s3.6 7 10 7a11.7 11.7 0 0 0 4-.7" }],
  ],
  info: [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }],
  ],
  "alert-triangle": [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      },
    ],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }],
  ],
  "alert-circle": [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 8v4" }],
    ["path", { d: "M12 16h.01" }],
  ],
  check: [["path", { d: "M20 6 9 17l-5-5" }]],
  "check-circle": [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m9 12 2 2 4-4" }],
  ],
  copy: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }],
  ],
  "chevron-left": [["path", { d: "m15 18-6-6 6-6" }]],
  "chevron-right": [["path", { d: "m9 18 6-6-6-6" }]],
  "arrow-right": [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "m12 5 7 7-7 7" }],
  ],
  play: [["polygon", { points: "6 3 20 12 6 21 6 3" }]],
  "external-link": [
    ["path", { d: "M15 3h6v6" }],
    ["path", { d: "M10 14 21 3" }],
    [
      "path",
      {
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
      },
    ],
  ],
  search: [
    ["circle", { cx: "11", cy: "11", r: "8" }],
    ["path", { d: "m21 21-4.3-4.3" }],
  ],
  download: [
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
    ["path", { d: "m7 10 5 5 5-5" }],
    ["path", { d: "M12 15V3" }],
  ],
  trash: [
    ["path", { d: "M3 6h18" }],
    ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
    ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
  ],
};

export const iconNames = /** @type {(keyof typeof icons)[]} */ (
  Object.keys(icons)
);

const SVG_NS = "http://www.w3.org/2000/svg";

const baseAttributes = (size) => ({
  xmlns: SVG_NS,
  width: String(size),
  height: String(size),
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "aria-hidden": "true",
  focusable: "false",
});

const escapeAttribute = (value) =>
  String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");

const attributesToString = (attributes) =>
  Object.entries(attributes)
    .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
    .join(" ");

function getIcon(name) {
  const nodes = icons[name];
  if (!nodes) throw new RangeError(`Unknown Cubyt icon: ${name}`);
  return nodes;
}

/** Serialize an icon to an SVG string. */
export function iconSvg(name, options = {}) {
  const { size = 16, className = "cubyt-icon" } = options;
  const children = getIcon(name)
    .map(([tag, attributes]) => `<${tag} ${attributesToString(attributes)}/>`)
    .join("");
  const attributes = { ...baseAttributes(size), class: className };
  return `<svg ${attributesToString(attributes)}>${children}</svg>`;
}

/** Create an icon as an `SVGElement` for vanilla DOM rendering. */
export function createIcon(name, options = {}) {
  const { size = 16, className = "cubyt-icon" } = options;
  const svg = document.createElementNS(SVG_NS, "svg");
  for (const [key, value] of Object.entries(baseAttributes(size))) {
    if (key !== "xmlns") svg.setAttribute(key, value);
  }
  svg.setAttribute("class", className);
  for (const [tag, attributes] of getIcon(name)) {
    const child = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attributes)) {
      child.setAttribute(key, value);
    }
    svg.append(child);
  }
  return svg;
}
