import { ChatInterface } from "@/components/chat-interface";

export default function ConsultaPage() {
  return (
    <div className="flex h-[calc(100svh-3.5rem)] max-h-[calc(100dvh-3.5rem)] flex-col overflow-hidden supports-[height:100dvh]:h-[calc(100dvh-3.5rem)]">
      <ChatInterface />
    </div>
  );
}
