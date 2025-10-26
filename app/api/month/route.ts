import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/month');
    
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching month data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch month data' },
      { status: 500 }
    );
  }
}