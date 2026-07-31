"use client";

import { useMemo, useState } from "react";

const SOURCES_HEADING =
  /\*\*(Fuentes consultadas|Sources consulted)\*\*|^Fuentes consultadas$|^Sources consulted$/i;

function parseSourcesBlock(content: string): {
  body: string;
  sources: string[];
  heading: string;
} {
  const lines = content.split("\n");
  let headingIndex = -1;
  let heading = "Fuentes consultadas";

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim().replace(/\*/g, "");
    if (/^Fuentes consultadas$/i.test(trimmed) || /^Sources consulted$/i.test(trimmed)) {
      headingIndex = i;
      heading = /sources consulted/i.test(trimmed)
        ? "Sources consulted"
        : "Fuentes consultadas";
      break;
    }
  }

  if (headingIndex === -1) {
    return { body: content, sources: [], heading };
  }

  const body = lines.slice(0, headingIndex).join("\n").trimEnd();
  const sources: string[] = [];
  for (let i = headingIndex + 1; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (/^Fuente:/i.test(trimmed) || /^- Fuente:/i.test(trimmed)) continue;
    const bullet = trimmed.replace(/^[-•*]\s+/, "").trim();
    if (bullet) sources.push(bullet);
  }

  return { body, sources, heading };
}

type Props = {
  content: string;
  renderBody: (body: string) => React.ReactNode;
};

/** Renders assistant text with a collapsible sources button instead of an inline list. */
export function AssistantMessageWithSources({ content, renderBody }: Props) {
  const { body, sources, heading } = useMemo(
    () => parseSourcesBlock(content),
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
            <ul className="mt-2 space-y-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              {sources.map((source) => (
                <li key={source}>
                  <a
                    href="/conocimientos"
                    className="block text-xs text-blue-600 underline-offset-2 hover:underline"
                  >
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export function stripInlineFuenteLines(content: string): string {
  return content
    .split("\n")
    .filter((line) => {
      const t = line.trim();
      return !(
        SOURCES_HEADING.test(t) ||
        /^Fuente:/i.test(t) ||
        /^- Fuente:/i.test(t) ||
        (/^Source:/i.test(t) || /^- Source:/i.test(t))
      );
    })
    .join("\n");
}
