import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { path, sessionId } = await request.json();

    if (!path || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if the user already visited this page in this session
    const existingVisit = await prisma.pageVisitSession.findUnique({
      where: {
        sessionId_path: {
          sessionId,
          path,
        },
      },
    });

    if (!existingVisit) {
      // Record the visit for this session to prevent duplicate counting
      await prisma.pageVisitSession.create({
        data: {
          sessionId,
          path,
        },
      });

      // Increment the total visit count for the page
      await prisma.pageAnalytics.upsert({
        where: { path },
        create: {
          path,
          visits: 1,
        },
        update: {
          visits: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
  }
}
