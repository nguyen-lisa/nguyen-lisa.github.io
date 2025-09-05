// contentlayer.config.ts
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
var Demo = defineNestedType(() => ({
  name: "Demo",
  fields: {
    label: { type: "string", required: false },
    url: { type: "string", required: true }
  }
}));
var Project = defineDocumentType(() => ({
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
    thumbnailAlt: { type: "string", required: false },
    ogImage: { type: "string", required: false },
    demo: { type: "nested", of: Demo, required: false },
    // instead of raw "json"
    repo: { type: "string", required: false }
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.replace(/^projects\//, "")
    },
    url: {
      type: "string",
      resolve: (doc) => `/project/${doc._raw.flattenedPath.replace(/^projects\//, "")}`
    }
  }
}));
var remarkPlugins = [remarkGfm];
var rehypePlugins = [
  rehypeSlug,
  [rehypeAutolinkHeadings, { behavior: "wrap" }]
];
var contentlayer_config_default = makeSource({
  contentDirPath: "src/content",
  documentTypes: [Project],
  mdx: {
    remarkPlugins,
    rehypePlugins
  }
});
export {
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-UWNK5ECP.mjs.map
