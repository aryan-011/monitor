import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;


  try {
    const monitor = await prisma.monitors.delete({
      where: { id: id }
    });

    if (!monitor) {
      return NextResponse.json("Monitor not found", { status: 404 });
    }

    return NextResponse.json("Deleted Succesfully", { status: 200 });
  } catch (error:any) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
