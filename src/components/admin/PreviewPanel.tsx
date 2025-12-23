"use client";

import MarkdownRenderer from "@/components/MarkdownRenderer";

interface PreviewPanelProps {
  title: string;
  content: string;
  fullWidth?: boolean;
}

export default function PreviewPanel({
  title,
  content,
  fullWidth = false,
}: PreviewPanelProps) {
  if (fullWidth) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-8 min-h-[2000px]">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Live Preview
          </h2>
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              {title}
            </h1>
          )}
        </div>
        {content ? (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <MarkdownRenderer content={content} />
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic text-center py-12">
            Start writing to see the preview...
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="sticky top-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 p-6 overflow-auto max-h-[calc(100vh-2rem)]">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          Preview
        </h2>
        {title && (
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {title}
          </h1>
        )}
      </div>
      {content ? (
        <MarkdownRenderer content={content} />
      ) : (
        <p className="text-gray-400 dark:text-gray-500 italic">
          Start writing to see the preview...
        </p>
      )}
    </div>
  );
}
