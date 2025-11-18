import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const system = await prisma.system.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!system) {
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }

    // Regular users can only see approved systems
    if (session.user.role !== 'ADMIN' && !system.approved) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(system);
  } catch (error) {
    console.error('Error fetching system:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
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
        { error: 'You do not have permission to edit this system' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, approved, ownerId } = body;

    const updatedSystem = await prisma.system.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(typeof approved === 'boolean' && { approved }),
        ...(ownerId && { ownerId }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedUsers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(updatedSystem);
  } catch (error) {
    console.error('Error updating system:', error);
    return NextResponse.json(
      { error: 'Failed to update system' },
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

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only admins can delete systems' },
        { status: 403 }
      );
    }

    await prisma.system.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'System deleted successfully' });
  } catch (error) {
    console.error('Error deleting system:', error);
    return NextResponse.json(
      { error: 'Failed to delete system' },
      { status: 500 }
    );
  }
}
