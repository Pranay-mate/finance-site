import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image, { type ImageProps } from "next/image";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-12 scroll-mt-24 text-3xl font-semibold tracking-tight first:mt-0 sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children, id }) => (
      <h2
        id={id}
        className="mt-12 scroll-mt-24 border-t border-border pt-10 text-2xl font-semibold tracking-tight"
      >
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3
        id={id}
        className="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight"
      >
        {children}
      </h3>
    ),
    h4: ({ children, id }) => (
      <h4 id={id} className="mt-6 text-base font-semibold">
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className="mt-5 text-base leading-relaxed text-foreground/90">
        {children}
      </p>
    ),
    a: ({ href, children, ...rest }) => {
      const isInternal = typeof href === "string" && href.startsWith("/");
      if (isInternal) {
        return (
          <Link
            href={href}
            className="font-medium text-foreground underline decoration-muted-foreground/50 underline-offset-4 transition hover:decoration-foreground"
          >
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-foreground underline decoration-muted-foreground/50 underline-offset-4 transition hover:decoration-foreground"
          {...rest}
        >
          {children}
        </a>
      );
    },
    ul: ({ children }) => (
      <ul className="my-5 list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-5 list-decimal space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-foreground/40 bg-muted/30 px-5 py-4 text-base italic text-foreground/80">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-[0.9em] font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted/30 p-4 text-xs leading-relaxed">
        {children}
      </pre>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-border bg-muted/20">{children}</thead>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-border/60 last:border-b-0 even:bg-muted/10">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2.5 align-top tabular-nums">{children}</td>
    ),
    hr: () => <hr className="my-10 border-border" />,
    img: (props) => {
      const imageProps = props as ImageProps;
      const { alt, ...rest } = imageProps;
      return (
        <Image
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt={alt ?? ""}
          {...rest}
        />
      );
    },
    ...components,
  };
}
