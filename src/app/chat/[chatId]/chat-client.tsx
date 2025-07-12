"use client";

export function ChatClientComponent({ chatId }: { chatId: string }) {
  return (
    <div className="flex flex-col h-[calc(100dvh-theme(spacing.14))] items-center justify-center">
        <h1 className="text-2xl font-bold">Chat Disabled</h1>
        <p className="text-muted-foreground">The direct messaging feature is currently unavailable.</p>
    </div>
  );
}
