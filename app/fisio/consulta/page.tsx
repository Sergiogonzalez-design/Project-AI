import { FisioChatInterface } from "@/components/fisio-chat-interface";

export default function FisioConsultaPage() {
  return (
    <div className="flex h-[calc(100svh-4.5rem)] max-h-[calc(100dvh-4.5rem)] flex-col overflow-hidden supports-[height:100dvh]:h-[calc(100dvh-4.5rem)]">
      <FisioChatInterface />
    </div>
  );
}
