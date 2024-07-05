
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
const prisma =new PrismaClient()
interface FormData {
  name: string;
  curl: string;
  fields: string;
}

export async function GET(request: NextRequest) {
  try {
    const  formData = await prisma.monitors.findMany({select:{id:true,name:true,fieldsToTrack:true,updatedAt:true,result:true}})
    if(!formData) throw Error("Id deosnt exists")
    // Handle form data (e.g., save to a database, send an email, etc.)
    // //console.log('Form data received:', formData);

    return NextResponse.json(formData);
  } catch (error) {
    console.error('Error processing form data:', error);
    return NextResponse.json({ message: 'Failed to submit form data' }, { status: 500 });
  }
}
