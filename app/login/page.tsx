
// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import axios from "axios"
// import { useRouter } from "next/navigation"
// import { useToast } from "@/hooks/use-toast"
// import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"

// export default function LoginPage() {
//   const router = useRouter()
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [errors, setErrors] = useState({})
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }))
//     }
//   }

//   const validateForm = () => {
//     let isValid = true
//     const newErrors = {}

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"
//       isValid = false
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid"
//       isValid = false
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required"
//       isValid = false
//     }

//     setErrors(newErrors)
//     return isValid
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     if (validateForm()) {
//       setIsLoading(true)
//       try {
//         console.log("Form Data:", formData)

//         const res = await axios.post("/api/users/login", formData, {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         })

//         console.log("Response:", res.data)

//         toast({
//           title: "Welcome back!",
//           description: "You have successfully logged in.",
//           duration: 5000,
//         })
//         router.push("/kanban")
//       } catch (error) {
//         console.error("Axios Error:", error)
//         const errorMessage = error.response?.data?.error || "An unexpected error occurred."

//         toast({
//           title: "Login Failed",
//           description: errorMessage,
//           duration: 5000,
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }
//   }

//   return (
//     <div className="min-h-screen relative flex items-center justify-center p-4">
//       {/* Background Image */}
//       <div
//        className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95"
//         style={{
//         //  backgroundImage: 'url("/abstract-geometric-pattern-black-and-white-minimal.jpg")',
//         backgroundImage: 'url("/blank-papers-multicolor-pens-isolated-grey-surface.jpg")',
//         }}
//       />

//       {/* Overlay for better contrast */}
//       <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/90 to-gray-50/95" />

//       <div className="relative w-full max-w-md z-10">
//         <Card className="shadow-2xl border border-gray-200/50 bg-white/98 backdrop-blur-md">
//           <CardHeader className="space-y-4 pb-8">
//             <div className="text-center space-y-2">
//               <div className="mx-auto w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mb-4 border border-gray-100">
//                 <Lock className="w-7 h-7 text-black" />
//               </div>
//               <CardTitle className="text-3xl font-bold text-black text-balance">Welcome back</CardTitle>
//               <CardDescription className="text-gray-600 text-pretty text-base">
//                 Sign in to your account to continue
//               </CardDescription>
//             </div>
//           </CardHeader>

//           <CardContent className="space-y-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-sm font-semibold text-black">
//                   Email address
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={`pl-10 h-12 transition-all duration-200 border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 ${
//                       errors.email ? "border-red-500 focus:ring-red-500/20" : ""
//                     }`}
//                   />
//                 </div>
//                 {errors.email && <p className="text-sm text-red-600 flex items-center gap-1">{errors.email}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-sm font-semibold text-black">
//                   Password
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className={`pl-10 pr-10 h-12 transition-all duration-200 border-gray-200 bg-white text-black placeholder:text-gray-400 focus:border-black focus:ring-black/20 ${
//                       errors.password ? "border-red-500 focus:ring-red-500/20" : ""
//                     }`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//                 {errors.password && <p className="text-sm text-red-600 flex items-center gap-1">{errors.password}</p>}
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white transition-all duration-200 group shadow-lg"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                     Signing in...
//                   </div>
//                 ) : (
//                   <div className="flex items-center gap-2">
//                     Sign in
//                     <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
//                   </div>
//                 )}
//               </Button>
//             </form>
//           </CardContent>

//           <CardFooter className="flex flex-col space-y-4 pt-6">
//             <Button
//               variant="ghost"
//               className="text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200"
//             >
//               Forgot your password?
//             </Button>

//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{" "}
//                 <a
//                   href="/signup"
//                   className="font-semibold text-black hover:text-gray-700 hover:underline transition-all duration-200"
//                 >
//                   Create account
//                 </a>
//               </p>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"

// Define types for form data and errors for better type safety
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      setIsLoading(true)
      try {
        console.log("Form Data:", formData)
        const res = await axios.post("/api/users/login", formData)

        console.log("Response:", res.data)
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        })
        router.push("/kanban")
      } catch (error) {
        console.error("Axios Error:", error)
        const errorMessage = axios.isAxiosError(error) && error.response
          ? error.response.data.error
          : "An unexpected error occurred."

        toast({
          title: "Login Failed",
          description: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
        style={{
          backgroundImage: 'url("/abstract-geometric-pattern-black-and-white-minimal.jpg")',
        }}
      />

      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-gray-50/60" />

      <div className="relative w-full max-w-md z-10">
        <Card className="shadow-2xl border border-gray-200/50 bg-white/98 backdrop-blur-md">
          <CardHeader className="space-y-4 pb-8">
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 bg-black/5 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <Lock className="w-7 h-7 text-black" />
              </div>
              <CardTitle className="text-3xl font-bold text-black text-balance">Welcome back</CardTitle>
              <CardDescription className="text-gray-600 text-pretty text-base">
                Sign in to your account to continue
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="password" className="text-sm font-semibold text-black">
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

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-black hover:bg-gray-800 text-white transition-all duration-200 group shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-6">
            <Button
              variant="ghost"
              className="text-sm text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-200"
            >
              Forgot your password?
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-semibold text-black hover:text-gray-700 hover:underline transition-all duration-200"
                >
                  Create account
                </a>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

