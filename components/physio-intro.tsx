import Image from "next/image";

type Props = {
  onSkip?: () => void;
  greeting?: string;
  locale?: "es" | "en";
};

export function PhysioIntro({
  onSkip,
  greeting,
  locale = "es",
}: Props) {
  const defaultGreeting =
    locale === "en"
      ? "Hi! I'm Physio, your AIKinora assistant. How can I help you today?"
      : "¡Hola! Soy Physio, tu asistente de AIKinora. ¿En qué puedo ayudarte hoy?";
  const tap = locale === "en" ? "Tap to continue" : "Toca para continuar";
  const aria = locale === "en" ? "Go to chat" : "Ir al chat";

  return (
    <button
      type="button"
      onClick={onSkip}
      className="flex h-full min-h-0 w-full cursor-pointer flex-col items-center justify-center border-0 bg-transparent px-4 py-6 text-center"
      aria-label={aria}
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
        <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
          {greeting ?? defaultGreeting}
        </p>
      </div>
      {onSkip ? (
        <p className="mt-5 text-sm font-semibold tracking-wide text-blue-600">
          {tap}
        </p>
      ) : null}
    </button>
  );
}
