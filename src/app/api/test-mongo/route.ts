import { runConnectionTest } from '@/lib/mongo-test';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await runConnectionTest();
    return NextResponse.json({ success: result, timestamp: new Date().toISOString() });
  } catch (error: unknown) {
    console.error('Error in test route:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to test connection', details: errorMessage }, { status: 500 });
  }
}
