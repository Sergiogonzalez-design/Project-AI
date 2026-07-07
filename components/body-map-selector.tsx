"use client";

import {
  regionsForView,
  toggleBodyMapRegion,
  bodyMapRegionLabel,
  type BodyMapRegionId,
  type BodyMapSelection,
  type BodyMapView,
} from "@/lib/body-map";
import { useState } from "react";

type Props = {
  value: BodyMapSelection;
  onChange: (v: BodyMapSelection) => void;
};

function BodySilhouette({ view }: { view: BodyMapView }) {
  const headY = 28;
  const torsoTop = 52;
  const torsoBottom = 195;
  const legBottom = 380;

  if (view === "front") {
    return (
      <g fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5">
        <ellipse cx="100" cy={headY} rx="22" ry="26" />
        <rect x="88" y={torsoTop - 4} width="24" height="12" rx="4" />
        <path d={`M 72 ${torsoTop} Q 100 ${torsoTop - 8} 128 ${torsoTop} L 118 ${torsoBottom} Q 100 ${torsoBottom + 8} 82 ${torsoBottom} Z`} />
        <path d={`M 72 ${torsoTop + 20} L 42 135 L 32 178 L 38 182 L 48 138 L 78 ${torsoTop + 30}`} />
        <path d={`M 128 ${torsoTop + 20} L 158 135 L 168 178 L 162 182 L 152 138 L 122 ${torsoTop + 30}`} />
        <path d={`M 82 ${torsoBottom} L 78 275 L 72 345 L 84 345 L 88 275 L 92 ${torsoBottom}`} />
        <path d={`M 118 ${torsoBottom} L 122 275 L 128 345 L 116 345 L 112 275 L 108 ${torsoBottom}`} />
      </g>
    );
  }

  return (
    <g fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5">
      <ellipse cx="100" cy={headY} rx="22" ry="26" />
      <rect x="88" y={torsoTop - 4} width="24" height="12" rx="4" />
      <path d={`M 72 ${torsoTop} Q 100 ${torsoTop - 8} 128 ${torsoTop} L 118 ${torsoBottom} Q 100 ${torsoBottom + 8} 82 ${torsoBottom} Z`} />
      <path d={`M 72 ${torsoTop + 20} L 42 135 L 32 178 L 38 182 L 48 138 L 78 ${torsoTop + 30}`} />
      <path d={`M 128 ${torsoTop + 20} L 158 135 L 168 178 L 162 182 L 152 138 L 122 ${torsoTop + 30}`} />
      <path d={`M 82 ${torsoBottom} L 78 275 L 72 345 L 84 345 L 88 275 L 92 ${torsoBottom}`} />
      <path d={`M 118 ${torsoBottom} L 122 275 L 128 345 L 116 345 L 112 275 L 108 ${torsoBottom}`} />
    </g>
  );
}

export function BodyMapSelector({ value, onChange }: Props) {
  const [view, setView] = useState<BodyMapView>("front");
  const visibleRegions = regionsForView(view);

  function handleToggle(regionId: BodyMapRegionId) {
    onChange(toggleBodyMapRegion(value, regionId));
  }

  return (
    <div>
      <div className="mb-3 flex gap-2">
        {(["front", "back"] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              view === v
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-blue-200 bg-white text-slate-600 hover:border-blue-400"
            }`}
          >
            {v === "front" ? "Vista frontal" : "Vista dorsal"}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-[220px]">
        <svg viewBox="0 0 200 400" className="w-full" role="img" aria-label="Mapa corporal interactivo">
          <BodySilhouette view={view} />
          {visibleRegions.map((region) => {
            const selected = value.regionIds.includes(region.id);
            return (
              <ellipse
                key={`${view}-${region.id}`}
                cx={region.cx}
                cy={region.cy}
                rx={region.rx}
                ry={region.ry}
                fill={selected ? "rgba(37, 99, 235, 0.55)" : "rgba(59, 130, 246, 0.12)"}
                stroke={selected ? "#1d4ed8" : "#3b82f6"}
                strokeWidth={selected ? 2.5 : 1.5}
                className="cursor-pointer transition-colors hover:fill-blue-300/40"
                onClick={() => handleToggle(region.id)}
                role="button"
                aria-label={region.label}
                aria-pressed={selected}
              />
            );
          })}
        </svg>
      </div>

      {value.regionIds.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.regionIds.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => handleToggle(id)}
              className="rounded-full border border-blue-600 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800"
            >
              {bodyMapRegionLabel(id)} ✕
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 text-xs text-slate-500">
        Toca las zonas donde sientes dolor. Puedes seleccionar varias.
      </p>
    </div>
  );
}
