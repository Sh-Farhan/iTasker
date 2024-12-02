'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation' // Adjust import
import axios from 'axios'

function Component() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Use this to get query params

    const [token, setToken] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState(null)

    const handleVerify = async () => {
        setIsVerifying(true)
        setError(null)

        try {
            await axios.post("/api/users/verifyemail", { token })
            setIsVerified(true)
        } catch (error) {
            // Extract a meaningful error message
            const errorMessage = error.response?.data?.error || "An error occurred"; // Assuming the error object has a key 'error'
            setError(errorMessage);
            console.log(error.response?.data);
        }
    }

    useEffect(() => {
        const urlToken = searchParams.get('token');
        console.log(urlToken)
        setToken(urlToken || "")
    }, [searchParams]) // Adding searchParams as a dependency

    useEffect(() => {
        if (token.length > 0) handleVerify()
    }, [token])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-500">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Email Verification</CardTitle>
                    <CardDescription>Click the button below to verify your email address.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!isVerified ? (
                        <Button 
                            onClick={handleVerify} 
                            disabled={isVerifying}
                            className="w-full"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Email'}
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center text-green-500">
                            <CheckCircle className="mr-2" />
                            <span>Email Verified Successfully!</span>
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 flex items-center justify-center text-red-500">
                            <XCircle className="mr-2" />
                            <span>{error}</span> {/* Ensure this is a string */}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Wrap the Component with Suspense in the Page component
const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Component />
        </Suspense>
    );
};

export default Page; // Single default export