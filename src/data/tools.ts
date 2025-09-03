// src/data/tools.ts
export const TOOLS = {
  nextjs:   { label: "Next.js" },
  react:    { label: "React" },
  tailwind: { label: "Tailwind CSS" },
  figma:    { label: "Figma" },
  java:     { label: "Java" },
  node:     { label: "Node.js" },
  ts:       { label: "TypeScript" },
  css:      { label: "CSS" },
} as const;

export type ToolKey = keyof typeof TOOLS;

export const toolKeys = Object.keys(TOOLS) as ToolKey[];

export function toolLabel(key: ToolKey) {
  return TOOLS[key].label;
}
