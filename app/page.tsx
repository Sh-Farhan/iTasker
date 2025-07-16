import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { FaEye } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Manager from "@/components/Manager";
import Header from "@/components/Header";

export default function Home() {
  return (
    <>
    {/* <Manager></Manager> */}
    <Header></Header>
    </>
  );
}
