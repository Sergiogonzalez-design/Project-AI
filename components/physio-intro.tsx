import Image from "next/image";

const DEFAULT_GREETING =
  "¡Hola! Soy Physio, tu asistente de Kinora. ¿En qué puedo ayudarte hoy?";

type Props = {
  onSkip?: () => void;
  greeting?: string;
};

export function PhysioIntro({ onSkip, greeting = DEFAULT_GREETING }: Props) {
  return (
    <button
      type="button"
      onClick={onSkip}
      className="flex h-full min-h-0 w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent px-4 py-6 text-center"
      aria-label="Ir al chat"
    >
      <div className="relative mb-6 w-full max-w-[280px] sm:max-w-xs">
        <Image
          src="/physio/physio-full.png"
          alt="Physio"
          width={320}
          height={740}
          className="mx-auto h-auto w-full max-h-[min(52vh,520px)] object-contain drop-shadow-lg"
          priority
        />
      </div>
      <div className="max-w-lg rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-md shadow-blue-500/10">
        <p className="text-sm leading-relaxed text-slate-700 sm:text-base">{greeting}</p>
      </div>
      {onSkip ? (
        <p className="mt-5 text-sm font-semibold tracking-wide text-blue-600">
          Toca para continuar
        </p>
      ) : null}
    </button>
  );
}

export const PHYSIO_GREETING = DEFAULT_GREETING;
