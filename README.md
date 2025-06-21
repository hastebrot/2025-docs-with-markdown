# 2025-markdocs

**usage:**

- `❯ git clone https://github.com/hastebrot/2025-markdocs`
- `❯ cd 2025-markdocs/packages/markdown-app`
- `❯ bun install`
- `❯ bun run dev:debug --port 3000`
- `❯ bun run build`

**project docs:**

slatedocs:

- https://eemeli.org/yaml/#yaml
  - https://github.com/eemeli/yaml/tree/v2.8.0/docs
  - https://slatedocs.github.io/slate/#introduction

remarkjs:

- https://github.com/remarkjs/react-markdown#architecture

> react-markdown is a unified pipeline. The processor goes through these steps:
> 1. parse markdown to mdast (markdown syntax tree)
> 2. transform through remark (markdown ecosystem)
> 3. transform mdast to hast (HTML syntax tree)
> 4. transform through rehype (HTML ecosystem)
> 5. render hast to React with components

- `❯ bun add -d react-markdown shiki @shikijs/rehype`
