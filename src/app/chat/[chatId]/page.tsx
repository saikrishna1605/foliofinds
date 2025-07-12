
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ChatClientComponent } from './chat-client';

function ChatPageSkeleton() {
    return (
        <div className="flex flex-col h-[calc(100dvh-theme(spacing.14))]">
            <div className="flex flex-row items-center gap-4 p-4 border-b">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                </div>
            </div>
            <div className="flex-1 p-4 space-y-4">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-16 w-3/4 ml-auto bg-primary/20" />
                <Skeleton className="h-10 w-1/2" />
            </div>
            <div className="p-4 border-t">
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export default function ChatPage({ params }: { params: { chatId: string } }) {
    return (
        <Suspense fallback={<ChatPageSkeleton />}>
            <ChatClientComponent chatId={params.chatId} />
        </Suspense>
    );
}
