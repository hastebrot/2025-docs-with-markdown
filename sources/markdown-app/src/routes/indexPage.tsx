import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Root } from "hast";
import Markdown from "react-markdown";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { visit } from "unist-util-visit";

export const IndexPage = () => {
  return (
    <main data-theme="dark" className="min-h-dvh">
      <div className="prose-invert prose prose-base prose-zinc p-4">
        <MarkdownSource source={yamlDocs["01_intro"].default} />
      </div>
    </main>
  );
};

const yamlDocs = {
  "01_intro": await import("../../assets/yaml-docs/01_intro.md?raw"),
};

type MarkdownSourceProps = {
  source: string;
};

const MarkdownSource = (props: MarkdownSourceProps) => {
  const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, "-");
  const rehypeSlug = function rehypeSlug() {
    return function transform(tree: Root) {
      visit(tree, "element", (node) => {
        if (node.tagName === "h1") {
          if (node.children[0].type === "text") {
            node.properties.id = slugify(node.children[0].value);
          }
        }
      });
    };
  };

  return (
    <Markdown
      children={props.source}
      components={{
        h1({ node, ...props }) {
          return <h1 className="font-[700]" {...props}></h1>;
        },
      }}
      remarkPlugins={[]}
      rehypePlugins={[
        rehypeSlug,
        [
          rehypeShikiFromHighlighter,
          shikiHighlighter,
          {
            themes: {
              light: "vitesse-light",
              dark: "vitesse-dark",
            },
            defaultColor: "dark",
          },
        ],
      ]}
    />
  );
};

const shikiHighlighter = await createHighlighterCore({
  themes: [import("@shikijs/themes/vitesse-light"), import("@shikijs/themes/vitesse-dark")],
  langs: [import("@shikijs/langs/javascript")],
  engine: createOnigurumaEngine(() => import("shiki/wasm")),
});
