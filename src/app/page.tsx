import Image from "next/image";
import TrackingTable from "./monitors/monitorsTable";
import  {SnackbarProvider} from './monitors/Snackbar' 
export default function Home() {
  return (

    <main className="flex flex-col items-center justify-start p-24">
        <h2 className="text-xl font-bold mt-8 mb-4">All Monitors </h2>
        <TrackingTable />
    </main>

  );
}
