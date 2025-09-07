// contentlayer.config.ts
import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files";
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
    categories: { type: "list", of: { type: "string" } },
    tools: { type: "list", of: { type: "string" } },
    featured: { type: "boolean", default: false },
    thumbnail: { type: "string" },
    ogImage: { type: "string" },
    demo: { type: "nested", of: Demo },
    repo: { type: "string" }
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
var contentlayer_config_default = makeSource({
  contentDirPath: "src/content",
  documentTypes: [Project],
  mdx: {
    // remarkPlugins: [remarkGfm],             // ⬅️ remove
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }]
    ]
  }
  // disableImportAliasWarning: true,
});
export {
  Project,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-4PLVWJUV.mjs.map
