import { defineDocumentType, defineNestedType, makeSource } from "contentlayer2/source-files";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** Nested type for the optional demo button */
const Demo = defineNestedType(() => ({
  name: "Demo",
  fields: {
    label: { type: "string", required: false },
    url: { type: "string", required: true },
  },
}));

/** Project MDX documents */
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
    thumbnailAlt: { type: "string", required: false }, // used for <Image> alt fallback
    ogImage: { type: "string", required: false },

    demo: { type: "nested", of: Demo, required: false },
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
  // your MDX lives under src/content
  contentDirPath: "src/content",
  documentTypes: [Project],
  mdx: {
    // remarkPlugins: [],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
  // disableImportAliasWarning: true,
});
