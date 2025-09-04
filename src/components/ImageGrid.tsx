"use client";

import { useEffect, useRef, useState } from "react";

type ImgItem = {
  src: string;
  alt: string;
  caption?: string;
};

export default function ImageGrid({ images }: { images: ImgItem[] }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevFocusRef = useRef<Element | null>(null);

  const openAt = (i: number) => {
    prevFocusRef.current = document.activeElement ?? null;
    setIdx(i);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    if (prevFocusRef.current instanceof HTMLElement) prevFocusRef.current.focus();
  };

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Grid of thumbnails */}
      <div
        className="not-prose grid grid-cols-2 md:grid-cols-3 gap-3"
        role="list"
        aria-label="Image gallery"
      >
        {images.map((img, i) => (
          <button
            key={i}
            role="listitem"
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            onClick={() => openAt(i)}
            aria-label={`Open image ${i + 1}: ${img.alt}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              loading="lazy"
              decoding="async"
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close(); // click outside to close
          }}
        >
          <figure
            className="relative"
            style={{ maxWidth: "min(90vw, 1100px)" }} // cap width
          >
            <img
              src={images[idx].src}
              alt={images[idx].alt}
              style={{
                maxHeight: "80vh",
                maxWidth: "100%",
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              className="rounded-xl border border-border bg-base"
            />

            {(images[idx].caption || images[idx].alt) && (
              <figcaption className="mt-2 text-sm text-white/90">
                {images[idx].caption ?? images[idx].alt}
              </figcaption>
            )}

            {/* Controls */}
            <div className="absolute top-2 right-2 z-10 flex gap-2">
              <button
                ref={closeBtnRef}
                type="button"
                className="btn btn-white"
                onClick={close}
                aria-label="Close preview"
              >
                Close
              </button>
            </div>

            {/* Left hotzone (clicks only on the button) */}
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <button
                type="button"
                className="btn btn-white ml-2 pointer-events-auto"
                onClick={prev}
                aria-label="Previous image"
              >
                ◀
              </button>
            </div>

            {/* Right hotzone (clicks only on the button) */}
            <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
              <button
                type="button"
                className="btn btn-white mr-2 pointer-events-auto"
                onClick={next}
                aria-label="Next image"
              >
                ▶
              </button>
            </div>
          </figure>
        </div>
      )}
    </>
  );
}
