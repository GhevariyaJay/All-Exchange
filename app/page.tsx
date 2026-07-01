import Image from "next/image";
import { CardEdgeToEdge } from "./components/Appbar"

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <CardEdgeToEdge />
    </div>
  );
}
