interface MapEmbedProps {
  src: string;
  title: string;
}

export function MapEmbed({ src, title }: MapEmbedProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line shadow-[0_10px_28px_rgba(23,50,89,0.12)]">
      <div className="relative w-full pb-[75%]">
        <iframe
          src={src}
          title={title}
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    </div>
  );
}
