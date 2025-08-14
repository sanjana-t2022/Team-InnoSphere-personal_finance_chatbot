"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function KrishnaWelcome() {
  const [currentAnimation, setCurrentAnimation] = useState(0)

  const animations = [
    { emoji: "🙏", text: "Namaste! I'm Krishna, your divine financial guide!" },
    { emoji: "✨", text: "Ready to unlock the secrets of wealth creation?" },
    { emoji: "💰", text: "Let's make your money work as smart as you do!" },
    { emoji: "🎯", text: "Together, we'll achieve all your financial dreams!" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center">
      <Card className="max-w-2xl mx-auto border-4 border-gradient-to-r from-orange-300 to-blue-300 shadow-2xl bg-gradient-to-br from-orange-50 to-blue-50">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="text-8xl mb-4 animate-bounce">{animations[currentAnimation].emoji}</div>
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-400 via-yellow-400 to-blue-500 flex items-center justify-center shadow-lg">
              <div className="text-4xl animate-pulse">🦚</div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
            {animations[currentAnimation].text}
          </h2>

          <div className="space-y-3 text-gray-700">
            <p className="text-lg">
              🌟 <strong>Personalized Financial Wisdom</strong> - Get advice tailored just for you
            </p>
            <p className="text-lg">
              📊 <strong>AI-Powered Tax Optimization</strong> - Save thousands legally
            </p>
            <p className="text-lg">
              🎮 <strong>Gamified Wealth Building</strong> - Make finance fun and rewarding
            </p>
            <p className="text-lg">
              🔒 <strong>Bank-Grade Security</strong> - Your data is completely safe
            </p>
          </div>

          <div className="mt-6 p-4 bg-yellow-100 rounded-lg border-2 border-yellow-300">
            <p className="text-yellow-800 font-medium">
              💡 <strong>Pro Tip:</strong> Users typically save ₹50,000+ in taxes in their first year!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
