import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: systemId, userId } = params;
    const { tags } = await request.json();

    // Get the system to check ownership
    const system = await prisma.system.findUnique({
      where: { id: systemId },
      select: { ownerId: true },
    });

    if (!system) {
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }

    // Check if user is admin or system owner
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = system.ownerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the system user tags
    const systemUser = await prisma.systemUser.update({
      where: {
        systemId_userId: {
          systemId,
          userId,
        },
      },
      data: {
        tags: tags || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(systemUser);
  } catch (error) {
    console.error('Error updating tags:', error);
    return NextResponse.json({ error: 'Failed to update tags' }, { status: 500 });
  }
}
