import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import type { Element, Root } from "hast";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import { visit } from "unist-util-visit";
import { classNames } from "../helpers/clsx";

const yamlDocs = {
  "01_intro.md": await import("../../assets/yaml-docs/01_intro.md?raw"),
  "02_parse_stringify.md": await import("../../assets/yaml-docs/02_parse_stringify.md?raw"),
  "03_options.md": await import("../../assets/yaml-docs/03_options.md?raw"),
};

export const IndexPage = () => {
  const source = [
    // wrap.
    yamlDocs["01_intro.md"].default,
    yamlDocs["02_parse_stringify.md"].default,
    yamlDocs["03_options.md"].default,
  ].join("\n");

  return (
    <main data-theme="dark" className="min-h-dvh">
      <div className="mx-auto w-fit">
        <MarkdownSource source={source} />
      </div>
    </main>
  );
};

type MarkdownSourceProps = {
  source: string;
};

const MarkdownSource = (props: MarkdownSourceProps) => {
  const rehypeSlatedocs = function rehypeSlatedocs() {
    return function transform(tree: Root) {
      const createColumnLeft = () =>
        ({
          type: "element",
          tagName: "div",
          properties: {
            className: classNames(
              "prose max-w-[70ch] prose-invert prose-base prose-zinc",
              "p-8 w-full border-x border-t border-(--border-base)"
            ),
          },
          children: [],
        } as Element);
      const createColumnRight = () =>
        ({
          type: "element",
          tagName: "div",
          properties: {
            className: classNames(
              "prose max-w-[60ch] prose-invert prose-base prose-zinc",
              "p-8 w-full border-r border-(--border-base)"
            ),
          },
          children: [],
        } as Element);
      const createBlock = () =>
        ({
          type: "element",
          tagName: "div",
          properties: {
            className: classNames("grid grid-cols-[auto_auto] mt-[-1px]"),
          },
          children: [],
        } as Element);

      const block = createBlock();
      let columnLeft = createColumnLeft();
      let columnRight = createColumnRight();
      block.children.push(columnLeft);
      block.children.push(columnRight);
      while (true) {
        const child = tree.children.shift();
        if (child === undefined) {
          break;
        }
        if (child.type === "element") {
          if (child.tagName === "h1") {
            columnLeft = createColumnLeft();
            columnRight = createColumnRight();
            block.children.push(columnLeft);
            block.children.push(columnRight);
          } else if (child.tagName === "h2") {
            columnLeft = createColumnLeft();
            columnRight = createColumnRight();
            block.children.push(columnLeft);
            block.children.push(columnRight);
          }
          if (child.tagName === "blockquote") {
            columnRight.children.push(child);
          } else if (child.tagName === "pre") {
            columnRight.children.push(child);
          } else {
            columnLeft.children.push(child);
          }
        }
      }

      tree.children.unshift(block);
    };
  };

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
      remarkPlugins={[
        // wrap.
        remarkGfm,
      ]}
      rehypePlugins={[
        // wrap.
        rehypeSlatedocs,
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
