import { NextResponse } from 'next/server';
import { recordRoundWinner, getRoundWinners } from '@/lib/db';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const battleId = url.searchParams.get('battleId') || undefined;
  const winners = await getRoundWinners(battleId);
  return NextResponse.json(winners);
}

export async function POST(request: Request) {
  try {
    const { battleId, round, winnerCode } = await request.json();
    if (!battleId || !round || !winnerCode) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    await recordRoundWinner(battleId, round, winnerCode);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error recording round' }, { status: 500 });
  }
}

