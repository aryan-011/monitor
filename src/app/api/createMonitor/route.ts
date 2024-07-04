
import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
// import fetch from 'node-fetch';
import { GET } from '../getMonitors/route';
const prisma =new PrismaClient()
interface FormData {
  name: string;
  curl: string;
  fields: string;
}
interface FetchObject {
  url: string;
  headers: { [key: string]: string }; 
}
function generateFetchFromCurl(cURL:string){
  const curlArr = cURL.split("\\")
  var ftch:FetchObject = {url:'',headers:{}}
  const headersRegex = /-H '([^']+)'/g;
  curlArr.map((t)=>{
    if(t.includes("curl")){
      ftch.url = t.trim().split(' ')[1].split("'")[1];
    }
    else{
      const regex = /'(.*?)'/g;
      const fnd = t.match(regex)
      if(fnd){
        const [key, value] = fnd[0].split("'")[1].split(":").map(part => part.trim());
        ftch.headers[`${key}`]=value
      }
    }
  })
   return ftch
}
export async function POST(request: NextRequest) {
  try {
    const formData: FormData = await request.json();

    // Handle form data (e.g., save to a database, send an email, etc.)
    // console.log('Form data received:', formData);
    const fetchObj = generateFetchFromCurl(formData.curl)
    fetch(fetchObj.url, { method: "GET", headers: fetchObj.headers })
  .then(resp => resp.json())
  .then(async (data) => { 
    if (!data.hasOwnProperty(formData.fields)) {
      return NextResponse.json({ message: 'Field does not exist' }, { status: 400 });
    }

    try {
      const monitor = await prisma.monitors.create({
        data: {
          name: formData.name,
          curl: formData.curl,
          fieldsToTrack: formData.fields,
          result: data[formData.fields].toString()
        }
      });

      console.log(monitor);
    } catch (error) {
      console.error('Error creating monitor:', error);
      throw error; // Optional: rethrow the error to propagate it further if needed
    }
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    throw error; 
  });
  
    
    return NextResponse.json({ message: 'Form data submitted successfully' });
  } catch (error) {
    console.error('Error processing form data:', error);
    return NextResponse.json({ message: 'Failed to submit form data' }, { status: 500 });
  }
}
