// contentlayer.config.ts
// @ts-nocheck  // keeps TS from nitpicking plugin types here

import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** Nested type for the demo button */
const Demo = defineNestedType(() => ({
  name: "Demo",
  fields: {
    label: { type: "string", required: false },
    url: { type: "string", required: true },
  },
}));

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: `projects/**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: { type: "string", required: true },
    summary: { type: "string", required: true },
    date: { type: "date", required: true },
    categories: { type: "list", of: { type: "string" }, required: false },
    tools: { type: "list", of: { type: "string" }, required: false },
    featured: { type: "boolean", required: false, default: false },
    thumbnail: { type: "string", required: false },
    ogImage: { type: "string", required: false },
    demo: { type: "nested", of: Demo, required: false }, // instead of raw "json"
    repo: { type: "string", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^projects\//, ""),
    },
    url: {
      type: "string",
      resolve: (doc) => `/project/${doc._raw.flattenedPath.replace(/^projects\//, "")}`,
    },
  },
}));

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    // Casts hush TS plugin type noise; runtime is fine
    rehypePlugins: [
      rehypeSlug as any,
      [rehypeAutolinkHeadings as any, { behavior: "wrap" }],
    ] as any[],
  },
  // You can silence the Windows/baseUrl warning if desired:
  // disableImportAliasWarning: true,
});
