import cron from 'node-cron'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const monitorTask = async () => {
    try {
      // Replace with actual monitoring logic, for example fetching data
      const monitors = await prisma.monitors.findMany();
      console.log('Monitors:', monitors);
    } catch (error) {
      console.error('Error in monitorTask:', error);
    }
  };


  cron.schedule('0 8,18 * * *', monitorTask);


  res.status(200).json({ message: `Scheduled twice a day` });
}
