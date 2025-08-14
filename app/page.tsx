"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, TrendingUp, Shield, Target } from "lucide-react"
import { KrishnaWelcome } from "@/components/krishna-welcome"
import { LoginPage } from "@/components/login-page"
import { ChatbotPage } from "@/components/chatbot-page"

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<"welcome" | "login" | "chatbot">("welcome")
  const [user, setUser] = useState<any>(null)

  if (currentPage === "chatbot" && user) {
    return (
      <ChatbotPage
        user={user}
        onLogout={() => {
          setUser(null)
          setCurrentPage("welcome")
        }}
      />
    )
  }

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={(userData) => {
          setUser(userData)
          setCurrentPage("chatbot")
        }}
        onBack={() => setCurrentPage("welcome")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-500 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-200 animate-pulse" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                FinSavvy AI
              </h1>
              <Sparkles className="h-8 w-8 text-yellow-200 animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-orange-100 font-medium">💡 Your Personal Tax & Investment Mentor</p>
          </div>
        </div>
      </header>

      {/* Krishna Welcome Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <KrishnaWelcome />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">🌟 Discover Your Financial Superpowers</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Smart Tax Savings</h3>
                <p className="text-gray-600 text-sm">
                  AI-powered analysis finds every legal deduction to maximize your savings
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Goal-Based Investing</h3>
                <p className="text-gray-600 text-sm">Personalized investment strategies aligned with your life goals</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Risk Assessment</h3>
                <p className="text-gray-600 text-sm">
                  Behavioral analysis creates your perfect risk-balanced portfolio
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">Gamified Journey</h3>
                <p className="text-gray-600 text-sm">Earn badges and track your financial health score as you grow</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Financial Future? 🚀
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands who've already saved lakhs in taxes and built wealth with Krishna's guidance!
          </p>
          <Button
            onClick={() => setCurrentPage("login")}
            size="lg"
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            🎯 Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 FinSavvy AI. Powered by IBM Granite AI. Your financial mentor for life. 🙏
          </p>
        </div>
      </footer>
    </div>
  )
}
