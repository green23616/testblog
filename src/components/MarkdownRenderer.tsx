'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content prose dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeHighlight]}>
        {content}
      </ReactMarkdown>
      <style jsx global>{`
        .markdown-content {
          color: rgb(17 24 39);
        }

        .dark .markdown-content {
          color: rgb(243 244 246);
        }

        .markdown-content h1,
        .markdown-content h2,
        .markdown-content h3,
        .markdown-content h4,
        .markdown-content h5,
        .markdown-content h6 {
          color: rgb(17 24 39);
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .dark .markdown-content h1,
        .dark .markdown-content h2,
        .dark .markdown-content h3,
        .dark .markdown-content h4,
        .dark .markdown-content h5,
        .dark .markdown-content h6 {
          color: rgb(243 244 246);
        }

        .markdown-content h1 {
          font-size: 2.25rem;
          line-height: 2.5rem;
        }

        .markdown-content h2 {
          font-size: 1.875rem;
          line-height: 2.25rem;
        }

        .markdown-content h3 {
          font-size: 1.5rem;
          line-height: 2rem;
        }

        .markdown-content p {
          margin-bottom: 1rem;
          line-height: 1.75;
        }

        .markdown-content a {
          color: rgb(37 99 235);
          text-decoration: underline;
        }

        .dark .markdown-content a {
          color: rgb(96 165 250);
        }

        .markdown-content a:hover {
          color: rgb(29 78 216);
        }

        .dark .markdown-content a:hover {
          color: rgb(147 197 253);
        }

        .markdown-content ul,
        .markdown-content ol {
          margin-bottom: 1rem;
          padding-left: 2rem;
        }

        .markdown-content li {
          margin-bottom: 0.5rem;
        }

        .markdown-content blockquote {
          border-left: 4px solid rgb(209 213 219);
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: rgb(107 114 128);
        }

        .dark .markdown-content blockquote {
          border-left-color: rgb(75 85 99);
          color: rgb(156 163 175);
        }

        .markdown-content pre {
          background-color: rgb(249 250 251);
          border: 1px solid rgb(229 231 235);
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .dark .markdown-content pre {
          background-color: rgb(17 24 39);
          border-color: rgb(75 85 99);
        }

        .markdown-content code {
          background-color: rgb(243 244 246);
          color: rgb(220 38 38);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono',
            monospace;
        }

        .dark .markdown-content code {
          background-color: rgb(31 41 55);
          color: rgb(252 165 165);
        }

        .markdown-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }

        .markdown-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }

        .markdown-content th,
        .markdown-content td {
          border: 1px solid rgb(229 231 235);
          padding: 0.75rem;
          text-align: left;
        }

        .dark .markdown-content th,
        .dark .markdown-content td {
          border-color: rgb(75 85 99);
        }

        .markdown-content th {
          background-color: rgb(243 244 246);
          font-weight: 600;
        }

        .dark .markdown-content th {
          background-color: rgb(31 41 55);
        }

        .markdown-content hr {
          border: none;
          border-top: 1px solid rgb(229 231 235);
          margin: 2rem 0;
        }

        .dark .markdown-content hr {
          border-top-color: rgb(75 85 99);
        }

        /* Override highlight.js for dark mode */
        .dark .markdown-content .hljs {
          background-color: rgb(17 24 39) !important;
        }
      `}</style>
    </div>
  );
}
