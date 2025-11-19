import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET /api/systems/[id]/fields - Get all custom fields for a system
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const fields = await prisma.systemField.findMany({
      where: { systemId: params.id },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(fields);
  } catch (error) {
    console.error('Error fetching system fields:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system fields' },
      { status: 500 }
    );
  }
}

// POST /api/systems/[id]/fields - Create a new custom field
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    if (!name) {
      return NextResponse.json(
        { error: 'Field name is required' },
        { status: 400 }
      );
    }

    // Check if field with same name already exists
    const existingField = await prisma.systemField.findUnique({
      where: {
        systemId_name: {
          systemId: params.id,
          name: name,
        },
      },
    });

    if (existingField) {
      return NextResponse.json(
        { error: 'A field with this name already exists' },
        { status: 400 }
      );
    }

    const field = await prisma.systemField.create({
      data: {
        systemId: params.id,
        name,
        fieldType: fieldType || 'text',
        options: options ? JSON.stringify(options) : null,
        required: required || false,
      },
    });

    return NextResponse.json(field, { status: 201 });
  } catch (error) {
    console.error('Error creating system field:', error);
    return NextResponse.json(
      { error: 'Failed to create system field' },
      { status: 500 }
    );
  }
}
