'use server';

// Direct messaging functionality is disabled.
export async function getOrCreateChat(currentUser: any, sellerId: string): Promise<{ chatId?: string; error?: string }> {
    return { error: "Chat feature is disabled." };
}
export async function getUserChats(userId: string): Promise<any[]> {
    return [];
}
export async function getChatDetails(chatId: string) {
    return null;
}
export async function getChatMessages(chatId:string): Promise<any[]> {
    return [];
}
export async function markChatAsRead(chatId: string, userId: string): Promise<void> {
    return;
}
