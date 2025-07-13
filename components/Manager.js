"use client"
import { Button } from "@/componentsBackup/ui/button"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { v4 as uuidv4 } from 'uuid';
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
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

import React, { useEffect, useRef } from 'react'
import { useState } from "react";
import { toggleVariants } from "./ui/toggle";
import { TableDemo } from "./PassTable";
import axios from "axios";

const Manager = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [myData,setMyData] = useState([]);
    const[toggle,setToggle] = useState(false)
    const { toast } = useToast()

    // const getData = async () => {
    //   let document = await axios.get("https://pass-manager-next-js.vercel.app/api/users");
    //   let dbData = (document.data)
    //   setMyData(dbData)
    // }

    useEffect(()=>{
      // getData();
    },[])

    const inputSiteRef = useRef(null);
    const inputUserRef = useRef(null);
    const inputPassRef = useRef(null);
    const toggleRef = useRef(null)

    const togglePasswordVisibility = () => {
      setToggle((prevState) => !prevState);
      setShowPassword((prevState) => !prevState);
      console.log(inputPassRef.current.type)
    };

    const dateGenerator = () => {
      const now = new Date();
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const day = daysOfWeek[now.getDay()]; // returns a number representing the day of the week, starting with 0 for Sunday
      const hours = now.getHours();
      const minutes = now.getMinutes()
      const month = now.getMonth() + 1; // Month is zero-based
      const year = now.getFullYear();
      const formattedDate = `${now.getDate()}/${month}/${year}`; 

      return [day,formattedDate,hours,minutes]
    }

    const submitData = () => {
      if(inputSiteRef.current.value && inputUserRef.current.value && inputPassRef.current.value){
        let myNewData = {
          id: uuidv4(),
          site: inputSiteRef.current.value,
          username: inputUserRef.current.value,
          password: inputPassRef.current.value,
        }
        setMyData([...myData,myNewData])
        axios.post("https://pass-manager-next-js.vercel.app/api/users",myNewData);

        const getDetails = dateGenerator();
        toast({
          title: "Action: Password added",
          description: `${getDetails[0]}, ${getDetails[1]} at  ${getDetails[2]}:${getDetails[3]}`,
          action: (
            <ToastAction altText="Goto schedule to undo">Back</ToastAction>
          ),
        }
      )
        inputSiteRef.current.value = null
        inputUserRef.current.value = null
        inputPassRef.current.value = null
     }
        else alert("Enter all the details")

    }

    const handleDelete = async (id) => {
      let c = confirm("Do you really want to delete this password");
      if(c){
        let updatedData = myData.filter((item) => item.id !== id);
        let deletedData = myData.filter((item) => item.id === id)[0];
        let res = await fetch("https://pass-manager-next-js.vercel.app/api/users",{
          method: "DELETE",
          headers: {"Content-type": "application/json"},
          body: JSON.stringify({
            site: deletedData.site,
            username: deletedData.username,
            password: deletedData.password
          })
        })
        console.log(res)
        setMyData(updatedData)
      }

    }

  return (
    <div className="mt-5">
     <div>
     <h1 className='text-4xl font-bold text-center'> 
        <span className='text-green-500'>&lt;</span>
            Pass.io
            <span className='text-green-500'>/&gt;</span>
        </h1>
     </div>
    <div className="container mt-10 mx-auto flex justify-center items-center">
    <Card className="w-1/2 bg-transparent">
      <CardHeader>
        <CardTitle>Enter the following details...</CardTitle> 
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="site">Site</Label>
              <Input ref={inputSiteRef} id="site" placeholder="Name of your site" />
            </div>

            <div className="flex flex-row justify-between">
            <div className="flex flex-col w-1/3 space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input ref={inputUserRef} id="username" placeholder="Name of your user" />
            </div>
            <div className="flex flex-col w-1/2 space-y-1.5 relative">
              <Label htmlFor="password">Password</Label>
              <Input ref={inputPassRef} id="password" type={toggle ? "text" : "password"} placeholder="Enter your password" />
    <span ref={toggleRef} onClick={togglePasswordVisibility} className="absolute top-[55%] right-2 transform -translate-y-1/2 flex items-center cursor-pointer">
      {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
    </span>
            </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="w-full mt-1.5" onClick={() => submitData()}>Submit</Button>
      </CardFooter>
    </Card>   
    </div>
    <TableDemo data={myData} deleteHandler={handleDelete}></TableDemo>
    </div>
  )
}

export default Manager
