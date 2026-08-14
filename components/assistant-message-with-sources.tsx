"use client";

import { useMemo, useState } from "react";
import { extractCitedSources, type CitedSource } from "@/lib/source-links";

type Props = {
  content: string;
  renderBody: (body: string) => React.ReactNode;
};

function SourceItem({ source }: { source: CitedSource }) {
  if (!source.href) {
    return <span className="block text-xs text-slate-600">{source.title}</span>;
  }

  return (
    <a
      href={source.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-xs text-blue-600 underline-offset-2 hover:underline"
    >
      {source.title}
    </a>
  );
}

/** Renders assistant text with a collapsible sources button instead of an inline list. */
export function AssistantMessageWithSources({ content, renderBody }: Props) {
  const { body, sources, heading } = useMemo(
    () => extractCitedSources(content),
    [content]
  );
  const [open, setOpen] = useState(false);

  return (
    <>
      {renderBody(body)}
      {sources.length > 0 ? (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            <span>{heading}</span>
            <span className="rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
              {sources.length}
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className={`transition ${open ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {open ? (
            <ul className="mt-2 space-y-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {sources.map((source) => (
                <li key={source.title}>
                  <SourceItem source={source} />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
