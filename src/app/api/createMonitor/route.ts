import cron from 'node-cron'
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import generateFetchFromCurl from '../utils'
const prisma = new PrismaClient()
interface FormData {
  name: string;
  curl: string;
  fields: string;
}


const monitorTask = async () => {
  try {
    const monitors = await prisma.monitors.findMany();
    monitors.forEach(async (m) => {
      try {
        const fetchObj = generateFetchFromCurl(m.curl);
        const response = await fetch(fetchObj.url, { method: "GET", headers: fetchObj.headers });
        const data = await response.json();

        if (!data.hasOwnProperty(m.fieldsToTrack)) {
          console.error('Field does not exist in response data');
          return;
        }

        const updatedMonitor = await prisma.monitors.update({
          where: { id: m.id },
          data: { result: data[m.fieldsToTrack].toString() }
        });

        //console.log('Monitor updated:', updatedMonitor);
      } catch (error) {
        console.error('Error updating monitor:', error);
        throw error; // Propagate the error further if necessary
      }
    });
  } catch (error) {
    console.error('Error fetching monitors:', error);
  }
};


export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();
    // console.log(formData)
    const fetchObj = generateFetchFromCurl(formData.curl);
    const response = await fetch(fetchObj.url, { method: "GET", headers: fetchObj.headers });
    if (response.status != 200) return NextResponse.json({message:"Invalid cURL"},{status:400})
    const data = await response.json();
    const fields = formData.fields
    const monitor = await prisma.monitors.findMany({
      where:{
        OR:[
          {
            curl: formData.curl
          }
        ]
      }
    })
    if(monitor.length >0){
      return NextResponse.json({message:"Already existing monitor"},{status:400})
    }

    
    let resultValue = '';
    if (fields.includes('.')) {
      const fieldPath = fields.split('.'); 
      let tempData = data;

      for (let i = 0; i < fieldPath.length; i++) {
        const currentField = fieldPath[i];
        if (currentField.includes('[') && currentField.includes(']')) {

          const indexStart = currentField.indexOf('[');
          const indexEnd = currentField.indexOf(']');
          const index = parseInt(currentField.substring(indexStart + 1, indexEnd), 10);
          const arrayField = currentField.substring(0, indexStart);

          if (!tempData.hasOwnProperty(arrayField) || !Array.isArray(tempData[arrayField]) || index >= tempData[arrayField].length) {
            return NextResponse.json({ message: "Field doesnt exists" }, { status: 400 });
          }

          tempData = tempData[arrayField][index];
        } else {

          if (!tempData.hasOwnProperty(currentField)) {
            
          }
          tempData = tempData[currentField]; 
        }
      }

      resultValue = tempData?.toString() ?? '';
    } else {
      if (!data.hasOwnProperty(fields)){
        return NextResponse.json({ message: "Field doesnt exists" }, { status: 400 });
      }
      resultValue = data[fields]?.toString() ?? '';
    }

    const createdMonitor = await prisma.monitors.create({
      data: {
        name: formData.name,
        curl: formData.curl,
        fieldsToTrack: formData.fields,
        result: resultValue.toString()
      }
    });

    cron.schedule('0 8,18 * * *', monitorTask);

    return NextResponse.json({ monitor: createdMonitor, message: "Created successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error processing form data:', error);
    return NextResponse.json({ message: 'error' }, { status: 500 });
  }
}
