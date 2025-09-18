"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Mail, User, ArrowRight } from "lucide-react"
import Link from "next/link"

// Define types for form data and errors for better type safety
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = (): boolean => {
    let isValid = true
    const newErrors: FormErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      try {
        const { username, email, password } = formData
        await axios.post("/api/users/signup", { username, email, password })

        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        })
        router.push("/login")
      } catch (error) {
        const errorMessage = axios.isAxiosError(error) && error.response
          ? error.response.data.error
          : "An unexpected error occurred."

        toast({
          title: "Signup Failed",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: 'url("/abstract-geometric-pattern-black-and-white-minimal.jpg")',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-gray-50/60" />

      <div className="relative w-full max-w-md z-10">
        <Card className="shadow-2xl border border-gray-200/50 bg-white/98 backdrop-blur-md">
          <CardHeader className="space-y-4 pb-8">
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <User className="w-7 h-7 text-black" />
              </div>
              <CardTitle className="text-3xl font-bold text-black text-balance">Create an Account</CardTitle>
              <CardDescription className="text-gray-600 text-pretty text-base">
                Get started with iTasker today
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-black">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`pl-10 h-12 transition-all duration-200 border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 ${
                      errors.username ? "border-red-500 focus:ring-red-500/20" : ""
                    }`}
                  />
                </div>
                {errors.username && <p className="text-sm text-red-600 flex items-center gap-1">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-black">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 h-12 transition-all duration-200 border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 ${
                      errors.email ? "border-red-500 focus:ring-red-500/20" : ""
                    }`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 flex items-center gap-1">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" aria-label="Password" className="text-sm font-semibold text-black">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 pr-10 h-12 transition-all duration-200 border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 ${
                      errors.password ? "border-red-500 focus:ring-red-500/20" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 flex items-center gap-1">{errors.password}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" aria-label="Confirm Password" className="text-sm font-semibold text-black">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 h-12 transition-all duration-200 border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 ${
                      errors.confirmPassword ? "border-red-500 focus:ring-red-500/20" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-600 flex items-center gap-1">{errors.confirmPassword}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white transition-all duration-200 group shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Create account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black hover:text-gray-700 hover:underline transition-all duration-200"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}