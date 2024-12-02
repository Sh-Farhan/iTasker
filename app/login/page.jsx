"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
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
// import { useToast } from "@/components/ui/use-toast"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const { toast } = useToast()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const validateForm = () => {
    let isValid = true
    let newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   if (validateForm()) {
  //     // Here you would typically send the login request to your backend
  //     let myData = JSON.stringify(formData)
  //     const res = await axios.post("/api/users/login" ,formData)
  //     console.log(res)   
  //     console.log("Login attempt with:", formData)
  //     toast({
  //       title: "Login Attempt",
  //       description: "Login functionality not implemented yet.",
  //     })
  //   }
  // }
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      try {
        // Check the form data structure
        console.log("Form Data:", formData);
  
        // Send login request
        const res = await axios.post("/api/users/login", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        // Log the response
        console.log("Response:", res.data);
  
        // Notify user of successful login
        toast({
          title: "Success",
          description: "You are logged in!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push('/tasks')
      } catch (error) {
        // Log and display the error
        console.error("Axios Error:", error);
        const errorMessage =
          error.response?.data?.error || "An unexpected error occurred.";
  
        toast({
          title: "Login Failed",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>
            <Button type="submit" className="w-full">Log In</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button variant="link" className="px-0 text-sm text-gray-600">
            Forgot your password?
          </Button>
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}