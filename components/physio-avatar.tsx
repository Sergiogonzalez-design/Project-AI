import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

/**
 * Source art is slightly left-weighted; object-position nudges the face into
 * the middle of the circular crop.
 */
export function PhysioAvatar({ size = 36, className = "" }: Props) {
  return (
    <Image
      src="/physio/physio-avatar.png"
      alt="Physio"
      width={size}
      height={size}
      quality={100}
      sizes={`${size}px`}
      unoptimized
      className={`shrink-0 rounded-full object-cover bg-blue-50 ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        objectPosition: "62% 42%",
      }}
    />
  );
}
