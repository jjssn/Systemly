import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// PUT /api/systems/[id]/fields/[fieldId] - Update a custom field
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or system owner
    const system = await prisma.system.findUnique({
      where: { id: params.id },
    });

    if (!system) {
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });

    if (!user || (user.role !== 'ADMIN' && system.ownerId !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, fieldType, options, required } = body;

    // If changing name, check if new name conflicts
    if (name) {
      const existingField = await prisma.systemField.findUnique({
        where: {
          systemId_name: {
            systemId: params.id,
            name: name,
          },
        },
      });

      if (existingField && existingField.id !== params.fieldId) {
        return NextResponse.json(
          { error: 'A field with this name already exists' },
          { status: 400 }
        );
      }
    }

    const field = await prisma.systemField.update({
      where: { id: params.fieldId },
      data: {
        ...(name && { name }),
        ...(fieldType && { fieldType }),
        ...(options !== undefined && { options: options ? JSON.stringify(options) : null }),
        ...(required !== undefined && { required }),
      },
    });

    return NextResponse.json(field);
  } catch (error) {
    console.error('Error updating system field:', error);
    return NextResponse.json(
      { error: 'Failed to update system field' },
      { status: 500 }
    );
  }
}

// DELETE /api/systems/[id]/fields/[fieldId] - Delete a custom field
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; fieldId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or system owner
    const system = await prisma.system.findUnique({
      where: { id: params.id },
    });

    if (!system) {
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email! },
    });

    if (!user || (user.role !== 'ADMIN' && system.ownerId !== user.id)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.systemField.delete({
      where: { id: params.fieldId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting system field:', error);
    return NextResponse.json(
      { error: 'Failed to delete system field' },
      { status: 500 }
    );
  }
}
