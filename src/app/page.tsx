import Image from "next/image";
import TrackingTable from "./monitors/monitorsTable";
export default function Home() {
  return (
    <main className="flex flex-col items-center justify-start p-24">
     <h1 className="text-2xl font-bold mb-1">Tracking Form</h1>
        <h2 className="text-xl font-bold mt-8 mb-4">All Tracking Forms</h2>
        <TrackingTable />
    </main>
  );
}
