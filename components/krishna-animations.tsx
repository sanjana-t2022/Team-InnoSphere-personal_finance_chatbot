"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export function KrishnaAnimations() {
  const [currentAnimation, setCurrentAnimation] = useState(0)

  const animations = [
    { emoji: "🕺", text: "Krishna is dancing with joy for your financial success!", bg: "from-pink-100 to-purple-100" },
    { emoji: "🧘", text: "Krishna is meditating on your investment strategy...", bg: "from-blue-100 to-green-100" },
    { emoji: "😴", text: "Krishna is dreaming of your wealthy future!", bg: "from-indigo-100 to-blue-100" },
    { emoji: "🎮", text: "Krishna is playing the wealth creation game!", bg: "from-yellow-100 to-orange-100" },
    { emoji: "📚", text: "Krishna is studying the latest tax laws for you!", bg: "from-green-100 to-teal-100" },
    { emoji: "🎯", text: "Krishna is focusing on your financial goals!", bg: "from-red-100 to-pink-100" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animations.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card
      className={`max-w-md mx-auto border-2 border-orange-200 bg-gradient-to-r ${animations[currentAnimation].bg} shadow-lg`}
    >
      <CardContent className="p-4 text-center">
        <div className="text-4xl mb-2 animate-bounce">{animations[currentAnimation].emoji}</div>
        <p className="text-sm font-medium text-gray-700">{animations[currentAnimation].text}</p>
      </CardContent>
    </Card>
  )
}
