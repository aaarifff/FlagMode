import { NextResponse } from 'next/server';
import { getAllSettings, updateSettingValue } from '@/lib/db';

export async function GET() {
  const settings = getAllSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      updateSettingValue(key, String(value));
    }
    return NextResponse.json({ success: true, settings: getAllSettings() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error updating settings' }, { status: 500 });
  }
}

