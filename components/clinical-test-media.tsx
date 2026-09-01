"use client";

import type { ClinicalTestImage } from "@/lib/clinical-test-images";
import { getClinicalTestVideoSrc } from "@/lib/clinical-test-videos";
import Image from "next/image";
import { useRef, useState } from "react";

type VideoPlayerProps = {
  src: string;
  title: string;
  poster?: string;
  className?: string;
};

export function ClinicalTestVideoPlayer({
  src,
  title,
  poster,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  async function enterFullscreen() {
    const el = videoRef.current;
    if (!el) return;
    try {
      if (el.requestFullscreen) {
        await el.requestFullscreen();
      } else {
        const webkit = el as HTMLVideoElement & {
          webkitEnterFullscreen?: () => void;
        };
        webkit.webkitEnterFullscreen?.();
      }
    } catch {
      /* browser blocked fullscreen */
    }
  }

  if (failed && poster) {
    return (
      <div
        className={`overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 ${className ?? ""}`}
      >
        <Image
          src={poster}
          alt={title}
          width={640}
          height={480}
          className="h-auto w-full max-w-md object-cover"
          sizes="(max-width: 768px) 100vw, 28rem"
        />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl border border-neutral-200 bg-black ${className ?? ""}`}
    >
      {failed ? (
        <div className="flex aspect-video w-full items-center justify-center bg-neutral-900 px-4 py-8 text-center text-sm text-neutral-300">
          No se pudo cargar el vídeo demostrativo.
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            key={src}
            src={src}
            poster={poster}
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full bg-black object-contain"
            aria-label={`Vídeo demostrativo: ${title}`}
            onError={() => setFailed(true)}
          >
            Tu navegador no puede reproducir este vídeo.
          </video>
          <button
            type="button"
            onClick={() => void enterFullscreen()}
            className="absolute bottom-2 right-2 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-slate-900"
            aria-label="Ver en pantalla completa"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Pantalla completa
          </button>
        </div>
      )}
    </div>
  );
}

type MediaBlockProps = {
  test: ClinicalTestImage;
  className?: string;
};

/** Prefer demo video when shipped; fall back to illustration. */
export function ClinicalTestMediaBlock({ test, className }: MediaBlockProps) {
  const videoSrc = getClinicalTestVideoSrc(test.id);
  if (videoSrc) {
    return (
      <ClinicalTestVideoPlayer
        src={videoSrc}
        title={test.title}
        poster={test.src}
        className={className ?? "mt-2 max-w-md"}
      />
    );
  }

  return (
    <div
      className={`${className ?? "mt-2"} overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50`}
    >
      <Image
        src={test.src}
        alt={test.title}
        width={640}
        height={480}
        className="h-auto w-full max-w-md object-cover"
        sizes="(max-width: 768px) 100vw, 28rem"
      />
    </div>
  );
}
