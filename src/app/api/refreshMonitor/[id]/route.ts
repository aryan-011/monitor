import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { generateFetchFromCurl } from '../../createMonitor/route';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;


  try {
    const monitor = await prisma.monitors.findUnique({
      where: { id: id }
    });

    if (!monitor) {
      return NextResponse.json("Monitor not found", { status: 404 });
    }

    const obj = generateFetchFromCurl(monitor.curl);
    const response = await fetch(obj.url, { method: "GET", headers: obj.headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data from URL: ${obj.url}`);
    }

    const data = await response.json();


    const updatedMonitor = await prisma.monitors.update({
      where: { id: id },
      data: {
        result: data[monitor.fieldsToTrack].toString()
      },
      select:{
        id:true,name:true,fieldsToTrack:true,updatedAt:true,result:true
      }
    });

    return NextResponse.json(updatedMonitor, { status: 200 });
  } catch (error:any) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
