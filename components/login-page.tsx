"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, Lock, Globe, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LoginPageProps {
  onLogin: (userData: any) => void
  onBack: () => void
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const countries = [
    { code: "IN", name: "India", currency: "₹" },
    { code: "US", name: "United States", currency: "$" },
    { code: "GB", name: "United Kingdom", currency: "£" },
    { code: "EU", name: "European Union", currency: "€" },
    { code: "CA", name: "Canada", currency: "C$" },
    { code: "AU", name: "Australia", currency: "A$" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const selectedCountry = countries.find((c) => c.code === formData.country)
      const userData = {
        name: formData.name || "User",
        email: formData.email,
        country: selectedCountry?.name || "India",
        currency: selectedCountry?.currency || "₹",
      }

      toast({
        title: "🎉 Welcome to FinSavvy AI!",
        description: `Krishna is excited to help you on your financial journey!`,
      })

      onLogin(userData)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button variant="ghost" onClick={onBack} className="mb-4 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Krishna Animation */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-2 animate-bounce">🦚</div>
          <p className="text-lg font-medium text-gray-700">
            {isSignUp ? "Krishna welcomes new devotees! 🙏" : "Krishna is waiting for you! ✨"}
          </p>
        </div>

        <Card className="border-2 border-orange-200 shadow-xl">
          <CardHeader className="text-center bg-gradient-to-r from-orange-400 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">{isSignUp ? "🌟 Join FinSavvy AI" : "🚀 Welcome Back"}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={isSignUp}
                    className="border-2 border-orange-200 focus:border-orange-400"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border-2 border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-2 border-orange-200 focus:border-orange-400"
                />
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Country
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => setFormData({ ...formData, country: value })}
                  >
                    <SelectTrigger className="border-2 border-orange-200 focus:border-orange-400">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.currency} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-400 to-blue-500 hover:from-orange-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : isSignUp ? (
                  "🎯 Create Account"
                ) : (
                  "🚀 Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">{isSignUp ? "Already have an account?" : "Don't have an account?"}</p>
              <Button
                variant="link"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                {isSignUp ? "Sign In Here" : "Sign Up Here"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
