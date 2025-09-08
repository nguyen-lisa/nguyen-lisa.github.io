// Define your known tools here
export const TOOLS = {
  nextjs:   { label: "Next.js" },
  tailwind: { label: "Tailwind CSS" },
  ts:       { label: "TypeScript" },
  react:    { label: "React" },
  a11y:     { label: "Accessibility" },
  figma:    { label: "Figma" },
  balsamiq: { label: "Balsamiq" },
} as const;

export type ToolKey = keyof typeof TOOLS;

// Pretty fallback if a key isn’t in TOOLS
function humanize(s: string) {
  return s
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase())
    .trim();
}

export function toolLabel(key: string) {
  const k = key.trim().toLowerCase();
  return TOOLS[k as ToolKey]?.label ?? humanize(k);
}

export const toolKeys = Object.keys(TOOLS) as ToolKey[];
