"use client";

import type { ClinicalTestImage } from "@/lib/clinical-test-images";
import { getClinicalTestVideoSrc } from "@/lib/clinical-test-videos";
import Image from "next/image";
import { useState } from "react";

type VideoPlayerProps = {
  src: string;
  title: string;
  className?: string;
};

export function ClinicalTestVideoPlayer({
  src,
  title,
  className,
}: VideoPlayerProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-neutral-200 bg-black ${className ?? ""}`}
    >
      {failed ? (
        <div className="flex aspect-video w-full items-center justify-center bg-neutral-900 px-4 py-8 text-center text-sm text-neutral-300">
          No se pudo cargar el vídeo demostrativo.
        </div>
      ) : (
        <video
          key={src}
          src={src}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black object-contain"
          aria-label={`Vídeo demostrativo: ${title}`}
          onError={() => setFailed(true)}
        >
          <track kind="captions" />
          Tu navegador no puede reproducir este vídeo.
        </video>
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
