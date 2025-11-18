import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = {
  params: {
    id: string;
  };
};

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const system = await prisma.system.findUnique({
      where: { id: params.id },
    });

    if (!system) {
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }

    // Check if user is admin or system owner
    const isOwner = system.ownerId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to assign users to this system' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user is already assigned
    const existing = await prisma.systemUser.findUnique({
      where: {
        systemId_userId: {
          systemId: params.id,
          userId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'User is already assigned to this system' },
        { status: 400 }
      );
    }

    const assignment = await prisma.systemUser.create({
      data: {
        systemId: params.id,
        userId,
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

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Error assigning user:', error);
    return NextResponse.json(
      { error: 'Failed to assign user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const system = await prisma.system.findUnique({
      where: { id: params.id },
    });

    if (!system) {
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }

    // Check if user is admin or system owner
    const isOwner = system.ownerId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: 'You do not have permission to remove users from this system' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await prisma.systemUser.delete({
      where: {
        systemId_userId: {
          systemId: params.id,
          userId,
        },
      },
    });

    return NextResponse.json({ message: 'User removed successfully' });
  } catch (error) {
    console.error('Error removing user:', error);
    return NextResponse.json(
      { error: 'Failed to remove user' },
      { status: 500 }
    );
  }
}
