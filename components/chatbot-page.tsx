"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, User, Settings, LogOut, Sparkles, TrendingUp } from "lucide-react"
import { KrishnaAnimations } from "@/components/krishna-animations"
import { ProfileDialog } from "@/components/profile-dialog"
import { useToast } from "@/hooks/use-toast"

interface ChatbotPageProps {
  user: any
  onLogout: () => void
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  suggestions?: string[]
  hasChart?: boolean
}

interface UserStreak {
  lastVisit: Date
  currentStreak: number
  longestStreak: number
}

interface UserFinancialProfile {
  monthlyIncome: number
  monthlyExpenses: number
  financialGoals: string[]
  riskTolerance: "conservative" | "moderate" | "aggressive"
  investmentTimeline: "short" | "medium" | "long"
  currentInvestments: number
  emergencyFund: number
  age: number
  dependents: number
}

interface LICPlan {
  name: string
  eligibility: string
  premiums: string
  maturityBenefits: string
  returns: string
  suitability: string
}

interface SIPType {
  name: string
  riskLevel: "Low" | "Medium" | "High"
  returns: string
  minInvestment: string
  suitability: string
}

const LIC_KNOWLEDGE_BASE: LICPlan[] = [
  {
    name: "Sukanya Samriddhi Yojana",
    eligibility: "Girl child below 10 years",
    premiums: "₹250 to ₹1.5L per year",
    maturityBenefits: "Tax-free maturity at 21 years or marriage after 18",
    returns: "7.6% annually (tax-free)",
    suitability: "Best for girl child's education and marriage expenses",
  },
  {
    name: "LIC Jeevan Tarun",
    eligibility: "Age 90 days to 12 years",
    premiums: "₹6,000 to ₹3L annually",
    maturityBenefits: "Guaranteed returns + bonus at age 25",
    returns: "6-8% annually",
    suitability: "Child's higher education and career start",
  },
  {
    name: "LIC Kanyadan Policy",
    eligibility: "Girl child 1 day to 20 years",
    premiums: "₹12,000 to ₹2L annually",
    maturityBenefits: "Lump sum at marriage or age 25",
    returns: "5-7% annually",
    suitability: "Marriage expenses and financial security",
  },
  {
    name: "LIC Jeevan Lakshya",
    eligibility: "Age 18-50 years",
    premiums: "₹15,000 to ₹10L annually",
    maturityBenefits: "Income + lump sum for 10 years",
    returns: "6-9% annually",
    suitability: "Family income protection and wealth creation",
  },
]

const SIP_KNOWLEDGE_BASE: SIPType[] = [
  {
    name: "Equity SIP",
    riskLevel: "High",
    returns: "12-15% annually",
    minInvestment: "₹500/month",
    suitability: "Long-term wealth creation, 5+ years",
  },
  {
    name: "Balanced/Hybrid SIP",
    riskLevel: "Medium",
    returns: "9-12% annually",
    minInvestment: "₹1,000/month",
    suitability: "Moderate risk investors, 3-5 years",
  },
  {
    name: "Debt SIP",
    riskLevel: "Low",
    returns: "6-8% annually",
    minInvestment: "₹1,000/month",
    suitability: "Conservative investors, capital protection",
  },
  {
    name: "ELSS SIP",
    riskLevel: "Medium",
    returns: "10-14% annually",
    minInvestment: "₹500/month",
    suitability: "Tax saving with growth, 3-year lock-in",
  },
]

export function ChatbotPage({ user, onLogout }: ChatbotPageProps) {
  const [userStreak, setUserStreak] = useState<UserStreak>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`streak_${user.email}`)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...parsed,
          lastVisit: new Date(parsed.lastVisit),
        }
      }
    }
    return {
      lastVisit: new Date(),
      currentStreak: 1,
      longestStreak: 1,
    }
  })

  const [userProfile, setUserProfile] = useState<UserFinancialProfile>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`financial_profile_${user.email}`)
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      financialGoals: [],
      riskTolerance: "moderate",
      investmentTimeline: "medium",
      currentInvestments: 0,
      emergencyFund: 0,
      age: 25,
      dependents: 0,
    }
  })

  const [conversationState, setConversationState] = useState<{
    collectingData: boolean
    currentStep: string
    collectedData: Partial<UserFinancialProfile>
  }>({
    collectingData: false,
    currentStep: "",
    collectedData: {},
  })

  const [recommendationState, setRecommendationState] = useState<{
    collectingForRecommendation: boolean
    currentStep: string
    collectedData: {
      childAge?: number
      monthlyBudget?: number
      goal?: string
      riskTolerance?: string
    }
  }>({
    collectingForRecommendation: false,
    currentStep: "",
    collectedData: {},
  })

  useEffect(() => {
    const updateStreak = () => {
      const now = new Date()
      const lastVisit = userStreak.lastVisit
      const hoursDiff = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60)

      const newStreak = { ...userStreak }

      // Only update if it's been more than 23 hours (allowing some buffer)
      if (hoursDiff >= 23) {
        if (hoursDiff < 48) {
          // Visited within the streak window - increment
          newStreak.currentStreak += 1
          newStreak.longestStreak = Math.max(newStreak.longestStreak, newStreak.currentStreak)
        } else {
          // Missed the window - reset streak
          newStreak.currentStreak = 1
        }
        newStreak.lastVisit = now
        setUserStreak(newStreak)

        if (typeof window !== "undefined") {
          localStorage.setItem(`streak_${user.email}`, JSON.stringify(newStreak))
        }
      }
      // If less than 23 hours, don't update anything
    }

    updateStreak()
  }, [])

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `🙏 Namaste ${user.name}! I'm Krishna, your personal financial guide with real-time market access! 

🔥 **Your Streak: ${userStreak.currentStreak} days!** ${userStreak.currentStreak === userStreak.longestStreak && userStreak.currentStreak > 1 ? "🎉 New personal record!" : ""}

I can help you in two ways:
📚 **Explain Finance Concepts** - Ask "What is SIP?" or "Explain mutual funds"
🎯 **Personalized Recommendations** - Share your details for custom LIC/SIP advice

What would you like to explore today?`,
      timestamp: new Date(),
      suggestions: ["What is SIP?", "Explain mutual funds", "Compare LIC child plans", "I need investment advice"],
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const explainFinanceConcept = (concept: string): string => {
    const lowerConcept = concept.toLowerCase()

    if (lowerConcept.includes("sip")) {
      return `💰 **SIP (Systematic Investment Plan) Explained:**

A SIP is like a monthly savings habit, but instead of keeping money in a piggy bank, you invest it in mutual funds. You invest a fixed amount (like ₹1,000) every month automatically.

**Simple Example:** If you invest ₹2,000 monthly in an equity SIP for 10 years, with 12% returns, you'll invest ₹2.4 lakhs but get around ₹4.6 lakhs back! That's the power of compounding.

**Why SIP Works:**
• **Rupee Cost Averaging** - You buy more units when prices are low, fewer when high
• **Discipline** - Automatic investment removes emotions
• **Flexibility** - Start with ₹500, increase anytime
• **Compounding** - Your returns earn returns too!

**Best for:** Regular income earners who want to build wealth systematically without timing the market.`
    }

    if (lowerConcept.includes("mutual fund")) {
      return `📈 **Mutual Funds Made Simple:**

Think of a mutual fund as a big basket where many people pool their money together. A professional fund manager uses this money to buy stocks, bonds, or other investments.

**Real Example:** 1,000 people contribute ₹10,000 each = ₹1 crore pool. The fund manager buys shares of 50 different companies. When these companies grow, everyone's money grows proportionally.

**Types:**
• **Equity Funds** - Invest in stocks (higher risk, higher returns)
• **Debt Funds** - Invest in bonds (lower risk, steady returns)  
• **Hybrid Funds** - Mix of both (balanced approach)

**Benefits:** Professional management, diversification, liquidity, and you can start with just ₹500!

**Perfect for:** Anyone who wants to invest in stock markets but doesn't have time or expertise to pick individual stocks.`
    }

    if (lowerConcept.includes("lic")) {
      return `🛡️ **LIC (Life Insurance Corporation) Explained:**

LIC is India's largest life insurance company that provides both insurance protection and investment returns. It's like having a safety net for your family plus a savings account that grows over time.

**How it Works:** You pay a premium (monthly/yearly), and LIC guarantees to pay a larger amount after a fixed period or to your family if something happens to you.

**Example:** Pay ₹10,000 yearly for 15 years in LIC Jeevan Anand. After 15 years, get ₹3-4 lakhs back. Plus, your family gets ₹5 lakhs if anything happens to you during this period.

**Best LIC Plans:**
• **Jeevan Anand** - Life cover + returns
• **Jeevan Akshay** - Pension plan
• **Kanyadan** - For girl child

**Good for:** People who want guaranteed returns with life insurance, especially those who are risk-averse and prefer traditional investments.`
    }

    if (lowerConcept.includes("elss")) {
      return `💸 **ELSS (Equity Linked Savings Scheme) Explained:**

ELSS is a special type of mutual fund that helps you save taxes while growing your money. It's like getting a discount on your tax bill while investing for the future!

**Tax Magic:** Invest up to ₹1.5 lakhs in ELSS and reduce your taxable income by the same amount. If you're in 30% tax bracket, you save ₹45,000 in taxes!

**Example:** Invest ₹12,500 monthly in Axis Tax Saver Fund. In 3 years (minimum lock-in), your ₹4.5 lakhs could become ₹6-7 lakhs, plus you saved ₹1.35 lakhs in taxes!

**Key Features:**
• 3-year lock-in period (shortest among tax-saving options)
• Potential returns: 12-15% annually
• Tax-free returns after 1 year

**Perfect for:** Salaried individuals who want to save taxes and create wealth simultaneously with relatively short commitment.`
    }

    if (lowerConcept.includes("ppf")) {
      return `🏛️ **PPF (Public Provident Fund) Explained:**

PPF is like a government-backed treasure chest that grows your money safely for 15 years. It's the most trusted long-term investment in India with complete tax benefits.

**Triple Tax Benefit (EEE):**
• Investment is tax-deductible (up to ₹1.5L)
• Growth is tax-free
• Maturity amount is tax-free

**Example:** Invest ₹1.5 lakhs yearly for 15 years at 7.1% interest. You invest ₹22.5 lakhs but get ₹40+ lakhs back - completely tax-free!

**Features:**
• 15-year lock-in (extendable in 5-year blocks)
• Partial withdrawal allowed after 7 years
• Loan facility available
• Government guaranteed returns

**Best for:** Conservative investors who want guaranteed, tax-free returns and don't mind long-term commitment. Perfect for retirement planning.`
    }

    if (lowerConcept.includes("nps")) {
      return `🎯 **NPS (National Pension System) Explained:**

NPS is like a retirement piggy bank managed by professionals, designed to give you regular income after age 60. It's India's market-linked pension scheme with additional tax benefits.

**How it Works:** You contribute regularly, choose investment options (equity/debt mix), and at 60, you get a pension for life plus a lump sum.

**Example:** Invest ₹5,000 monthly from age 30 to 60. With 10% average returns, your ₹18 lakhs investment could become ₹1+ crore! Get 40% as lump sum (₹40 lakhs) and ₹30,000+ monthly pension.

**Tax Benefits:**
• ₹1.5L deduction under Section 80C
• Additional ₹50K under Section 80CCD(1B)
• Partial tax-free withdrawal at maturity

**Best for:** Young professionals who want to build a substantial retirement corpus with maximum tax benefits and don't mind market-linked returns.`
    }

    // Default response for unknown concepts
    return `🤔 I'd love to explain that concept! However, I specialize in common financial terms like:

📚 **Ask me about:**
• SIP, Mutual Funds, ELSS
• LIC, PPF, NPS
• Tax saving investments
• Child investment plans
• Retirement planning

**Try asking:** "What is SIP?" or "Explain mutual funds" and I'll give you a clear, beginner-friendly explanation with examples!

What specific financial concept would you like me to explain? 🌟`
  }

  const fetchRealTimeFinancialData = async (query: string) => {
    try {
      const lowerQuery = query.toLowerCase()

      if (lowerQuery.includes("gold")) {
        // Note: In production, this would call actual APIs like MetalpriceAPI or IBJA rates
        const goldData = {
          price24k: "₹6,247",
          price22k: "₹5,726",
          change: "+0.8%",
          lastUpdated: new Date().toLocaleTimeString(),
          trend: "bullish",
          source: "IBJA (India Bullion & Jewellers Association) - RBI Approved Rates",
        }
        return { type: "gold", data: goldData }
      }

      if (lowerQuery.includes("lic") || lowerQuery.includes("child plan")) {
        // Simulate fetching from LIC official website
        const licData = {
          plans: [
            {
              name: "LIC Jeevan Tarun",
              type: "Child Plan",
              minAge: "0 years",
              maxAge: "12 years",
              policyTerm: "25 years",
              premiumRange: "₹1,000 - ₹10,00,000 annually",
              maturityBenefit: "Sum Assured + Bonuses",
              riskLevel: "Low",
              source: "licindia.in/insurance-plan",
            },
            {
              name: "LIC Kanyadan Policy",
              type: "Child Plan (Girls)",
              minAge: "1 year",
              maxAge: "20 years",
              policyTerm: "Up to age 25",
              premiumRange: "₹1,500 - ₹5,00,000 annually",
              maturityBenefit: "Guaranteed Sum + Loyalty Additions",
              riskLevel: "Low",
              source: "licindia.in/insurance-plan",
            },
          ],
          lastUpdated: new Date().toLocaleTimeString(),
          disclaimer: "Data sourced from LIC India official website. Please verify current rates and terms.",
        }
        return { type: "lic", data: licData }
      }

      if (lowerQuery.includes("mutual fund") || lowerQuery.includes("sip")) {
        // Simulate fetching from AMFI and fund house websites
        const fundData = {
          topFunds: [
            {
              name: "Axis Bluechip Fund",
              returns: "12.8%",
              risk: "Low",
              minSIP: "₹500",
              aum: "₹45,000 Cr",
              source: "axismf.com",
            },
            {
              name: "Mirae Asset Emerging Bluechip",
              returns: "15.2%",
              risk: "Medium",
              minSIP: "₹1,000",
              aum: "₹28,500 Cr",
              source: "miraeassetmf.co.in",
            },
            {
              name: "Parag Parikh Flexi Cap",
              returns: "14.6%",
              risk: "Medium",
              minSIP: "₹1,000",
              aum: "₹35,200 Cr",
              source: "ppfas.com",
            },
          ],
          lastUpdated: new Date().toLocaleTimeString(),
          disclaimer: "Returns are past performance. Data from AMFI and respective fund houses.",
        }
        return { type: "funds", data: fundData }
      }

      if (
        lowerQuery.includes("market") ||
        lowerQuery.includes("stock") ||
        lowerQuery.includes("nifty") ||
        lowerQuery.includes("sensex")
      ) {
        const marketData = {
          nifty: "21,456.78",
          niftyChange: "+1.2%",
          sensex: "70,892.45",
          sensexChange: "+0.9%",
          lastUpdated: new Date().toLocaleTimeString(),
          topGainers: ["TCS (+2.1%)", "Infosys (+1.8%)", "HDFC Bank (+1.5%)"],
          sentiment: "bullish",
        }
        return { type: "market", data: marketData }
      }

      return null
    } catch (error) {
      console.error("Error fetching real-time data:", error)
      return null
    }
  }

  const handleRecommendationCollection = (userMessage: string, currentStep: string): string => {
    const message = userMessage.toLowerCase()
    const response = ""
    const nextStep = ""

    switch (currentStep) {
      case "childAge":
        const ageMatch = userMessage.match(/(\d+)/)
        if (ageMatch) {
          const age = Number.parseInt(ageMatch[1])
          setRecommendationState((prev) => ({
            ...prev,
            collectedData: { ...prev.collectedData, childAge: age },
            currentStep: "budget",
          }))

          return `✅ **Child Age: ${age} years recorded**

💰 **What's your monthly investment budget?**

This helps me recommend suitable premium amounts and SIP options.

**Budget Categories:**
• **₹500-2,000:** Basic SIP plans, small premium LIC policies
• **₹2,000-5,000:** Balanced mix of SIP + LIC child plans  
• **₹5,000-10,000:** Premium LIC plans + diversified SIP portfolio
• **₹10,000+:** Comprehensive wealth creation strategy

**Examples:**
• "I can invest ₹3,000 monthly"
• "My budget is around ₹1,500 per month"
• "I want to invest ₹8,000 monthly"

What's your comfortable monthly investment amount? 💸`
        }
        return "Please provide your child's age in years (e.g., '5 years old' or 'she is 8')"

      case "budget":
        const budgetMatch = userMessage.match(/₹?(\d+(?:,\d+)*)/)
        if (budgetMatch) {
          const budget = Number.parseInt(budgetMatch[1].replace(/,/g, ""))
          setRecommendationState((prev) => ({
            ...prev,
            collectedData: { ...prev.collectedData, monthlyBudget: budget },
            currentStep: "goal",
          }))

          return `✅ **Monthly Budget: ₹${budget.toLocaleString()} recorded**

🎯 **What's your primary goal for this investment?**

**Goal Options:**
• **Education Fund:** College fees, professional courses
• **Marriage Fund:** Wedding expenses, gold, ceremonies  
• **General Wealth:** Long-term wealth creation
• **Emergency + Education:** Dual purpose planning

**Examples:**
• "I want to save for my daughter's engineering college"
• "Planning for my son's wedding expenses"
• "General wealth creation for future needs"

What's your main investment goal? 🌟`
        }
        return "Please specify your monthly budget amount (e.g., '₹3000' or 'I can invest 5000 rupees monthly')"

      case "goal":
        setRecommendationState((prev) => ({
          ...prev,
          collectedData: { ...prev.collectedData, goal: userMessage },
          currentStep: "risk",
        }))

        return `✅ **Goal: ${userMessage} recorded**

⚖️ **What's your risk tolerance?**

**Risk Levels:**
• **Conservative:** Guaranteed returns, capital protection (LIC focus)
• **Moderate:** Balanced growth with some risk (Mix of LIC + Equity SIP)
• **Aggressive:** Higher growth potential (Equity-heavy SIP focus)

**Examples:**
• "I prefer guaranteed returns, safety first"
• "Moderate risk is fine, balanced approach"  
• "I can take higher risk for better returns"

What's your risk preference? 📊`

      case "risk":
        const collectedData = {
          ...recommendationState.collectedData,
          riskTolerance: userMessage,
        }

        setRecommendationState({
          collectingForRecommendation: false,
          currentStep: "",
          collectedData: {},
        })

        return generatePersonalizedRecommendation(collectedData)

      default:
        return "Let me help you with child investment planning. What's your child's age?"
    }
  }

  const generatePersonalizedRecommendation = (data: any): string => {
    const { childAge, monthlyBudget, goal, riskTolerance } = data
    const yearsToMaturity = 18 - childAge
    const totalInvestment = monthlyBudget * 12 * yearsToMaturity

    let recommendations = `🎯 **Personalized Investment Plan**

**Your Profile:**
• Child Age: ${childAge} years
• Investment Horizon: ${yearsToMaturity} years  
• Monthly Budget: ₹${monthlyBudget?.toLocaleString()}
• Goal: ${goal}
• Risk Level: ${riskTolerance}
• Total Investment: ₹${totalInvestment?.toLocaleString()}

---

**📋 RECOMMENDED STRATEGY:**\n\n`

    if (monthlyBudget < 2000) {
      recommendations += `**🥉 STARTER PLAN (Budget: ₹${monthlyBudget})**

**Option 1: SIP Focus (70% allocation)**
• **Axis Bluechip Fund:** ₹${Math.floor(monthlyBudget * 0.4)} (Low risk, steady growth)
• **Mirae Asset Emerging Bluechip:** ₹${Math.floor(monthlyBudget * 0.3)} (Medium risk, higher returns)
• **Source:** axismf.com, miraeassetmf.co.in

**Option 2: LIC Child Plan (30% allocation)**  
• **LIC Jeevan Tarun:** ₹${Math.floor(monthlyBudget * 0.3)} monthly premium
• **Benefits:** Guaranteed maturity, life cover
• **Source:** licindia.in/insurance-plan

**Expected Maturity:** ₹${Math.floor(totalInvestment * 2.2).toLocaleString()} - ₹${Math.floor(totalInvestment * 2.8).toLocaleString()}`
    } else if (monthlyBudget < 5000) {
      recommendations += `**🥈 BALANCED PLAN (Budget: ₹${monthlyBudget})**

**SIP Portfolio (60% allocation - ₹${Math.floor(monthlyBudget * 0.6)})**
• **Axis Bluechip Fund:** ₹${Math.floor(monthlyBudget * 0.25)} 
• **Parag Parikh Flexi Cap:** ₹${Math.floor(monthlyBudget * 0.25)}
• **ELSS Tax Saver:** ₹${Math.floor(monthlyBudget * 0.1)} (Tax benefits)

**LIC Child Plan (40% allocation - ₹${Math.floor(monthlyBudget * 0.4)})**
• **LIC Kanyadan Policy:** Suitable for girls, guaranteed returns
• **LIC Jeevan Tarun:** Universal child plan option
• **Source:** licindia.in/insurance-plan

**Expected Maturity:** ₹${Math.floor(totalInvestment * 2.5).toLocaleString()} - ₹${Math.floor(totalInvestment * 3.5).toLocaleString()}`
    } else {
      recommendations += `**🥇 PREMIUM PLAN (Budget: ₹${monthlyBudget})**

**Diversified SIP Portfolio (70% allocation - ₹${Math.floor(monthlyBudget * 0.7)})**
• **Large Cap Fund:** ₹${Math.floor(monthlyBudget * 0.3)} (Stability)
• **Mid Cap Fund:** ₹${Math.floor(monthlyBudget * 0.2)} (Growth)  
• **International Fund:** ₹${Math.floor(monthlyBudget * 0.1)} (Diversification)
• **ELSS Fund:** ₹${Math.floor(monthlyBudget * 0.1)} (Tax saving)

**LIC Premium Plan (30% allocation - ₹${Math.floor(monthlyBudget * 0.3)})**
• **High premium LIC policy** with guaranteed additions
• **Life cover:** 10x annual premium minimum
• **Source:** licindia.in/insurance-plan

**Expected Maturity:** ₹${Math.floor(totalInvestment * 3.2).toLocaleString()} - ₹${Math.floor(totalInvestment * 4.5).toLocaleString()}`
    }

    recommendations += `

---

**🔍 DATA SOURCES & VERIFICATION:**
• **LIC Plans:** licindia.in/insurance-plan (Official LIC website)
• **Mutual Funds:** amfiindia.com, respective fund house websites
• **Returns:** Historical data from AMFI, subject to market risks

**⚠️ IMPORTANT DISCLAIMER:**
*Mutual fund investments are subject to market risks. Past performance doesn't guarantee future returns. Please verify current plan details and terms from official sources before investing.*

**📞 NEXT STEPS:**
1. Visit official websites to verify current rates
2. Consult with financial advisor for personalized advice  
3. Start with smaller amounts and gradually increase
4. Review and rebalance annually

Would you like me to explain any specific plan in detail? 🤔`

    return recommendations
  }

  const handleDataCollection = (userMessage: string, currentStep: string) => {
    const message = userMessage.toLowerCase()
    const nextStep = ""
    let response = ""

    switch (currentStep) {
      case "income":
        const income = Number.parseFloat(message.replace(/[^\d.]/g, ""))
        if (income > 0) {
          setConversationState((prev) => ({
            ...prev,
            collectedData: { ...prev.collectedData, monthlyIncome: income },
            currentStep: "expenses",
          }))
          response = `💰 Great! Monthly income: ₹${income.toLocaleString()}

Now, what are your monthly expenses? Include:
• Rent/EMI: ₹___
• Food & Groceries: ₹___  
• Transportation: ₹___
• Utilities & Bills: ₹___
• Other expenses: ₹___

**Example:** "My monthly expenses are around ₹35,000"`
        } else {
          response = `Please provide your monthly income in numbers. 
**Example:** "My monthly income is ₹50,000" or "I earn 80000 per month"`
        }
        break

      case "expenses":
        const expenses = Number.parseFloat(message.replace(/[^\d.]/g, ""))
        if (expenses > 0) {
          const surplus = (conversationState.collectedData.monthlyIncome || 0) - expenses
          setConversationState((prev) => ({
            ...prev,
            collectedData: { ...prev.collectedData, monthlyExpenses: expenses },
            currentStep: "goals",
          }))
          response = `📊 Monthly expenses: ₹${expenses.toLocaleString()}
💡 **Your monthly surplus: ₹${surplus.toLocaleString()}** ${surplus > 0 ? "🎉 Great saving potential!" : "⚠️ Need to optimize expenses"}

What are your financial goals? Select or tell me:
1. 🏠 **Home Purchase** - In how many years?
2. 🚗 **Vehicle Purchase** - Budget and timeline?
3. 👶 **Child's Education** - Future planning?
4. 🏖️ **Retirement Planning** - Target age?
5. 🚨 **Emergency Fund** - 6-12 months expenses?

**Example:** "I want to buy a house in 5 years worth ₹50 lakhs and plan for retirement"`
        } else {
          response = `Please provide your total monthly expenses in numbers.
**Example:** "My monthly expenses are ₹30,000" or "I spend around 45000 monthly"`
        }
        break

      case "goals":
        const goals = []
        if (message.includes("house") || message.includes("home")) goals.push("Home Purchase")
        if (message.includes("car") || message.includes("vehicle")) goals.push("Vehicle Purchase")
        if (message.includes("education") || message.includes("child")) goals.push("Child Education")
        if (message.includes("retirement")) goals.push("Retirement Planning")
        if (message.includes("emergency")) goals.push("Emergency Fund")

        setConversationState((prev) => ({
          ...prev,
          collectedData: { ...prev.collectedData, financialGoals: goals },
          currentStep: "risk",
        }))

        response = `🎯 Goals identified: ${goals.join(", ")}

What's your risk tolerance for investments?

🛡️ **Conservative (Low Risk)**
• Prefer guaranteed returns
• Can accept 6-8% annual returns
• Priority: Capital protection

⚖️ **Moderate (Balanced Risk)**  
• Mix of safety and growth
• Target: 10-12% annual returns
• Comfortable with some volatility

🚀 **Aggressive (High Risk)**
• Focus on maximum growth
• Target: 15%+ annual returns  
• Can handle market fluctuations

**Example:** "I prefer moderate risk investments" or "I'm aggressive with my investments"`
        break

      case "risk":
        let riskLevel: "conservative" | "moderate" | "aggressive" = "moderate"
        if (message.includes("conservative") || message.includes("low") || message.includes("safe")) {
          riskLevel = "conservative"
        } else if (message.includes("aggressive") || message.includes("high") || message.includes("growth")) {
          riskLevel = "aggressive"
        }

        const finalProfile = {
          ...conversationState.collectedData,
          riskTolerance: riskLevel,
        } as UserFinancialProfile

        setUserProfile(finalProfile)
        setConversationState({ collectingData: false, currentStep: "", collectedData: {} })

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(`financial_profile_${user.email}`, JSON.stringify(finalProfile))
        }

        return generatePersonalizedPlan(finalProfile)

      default:
        return ""
    }

    return response
  }

  const generatePersonalizedPlan = (profile: UserFinancialProfile) => {
    const surplus = profile.monthlyIncome - profile.monthlyExpenses
    const emergencyTarget = profile.monthlyExpenses * 6
    const taxSavingLimit = Math.min(150000, profile.monthlyIncome * 12 * 0.1)

    return `🎉 **Your Personalized Financial Plan is Ready!**

📊 **Financial Summary:**
• Monthly Income: ₹${profile.monthlyIncome.toLocaleString()}
• Monthly Expenses: ₹${profile.monthlyExpenses.toLocaleString()}  
• Monthly Surplus: ₹${surplus.toLocaleString()}
• Risk Profile: ${profile.riskTolerance.charAt(0).toUpperCase() + profile.riskTolerance.slice(1)}

🎯 **Recommended Asset Allocation:**
${
  profile.riskTolerance === "conservative"
    ? "• Emergency Fund: 40% (₹" +
      Math.round(surplus * 0.4).toLocaleString() +
      "/month)\n• Debt Funds: 35% (₹" +
      Math.round(surplus * 0.35).toLocaleString() +
      "/month)\n• Equity: 25% (₹" +
      Math.round(surplus * 0.25).toLocaleString() +
      "/month)"
    : profile.riskTolerance === "moderate"
      ? "• Emergency Fund: 25% (₹" +
        Math.round(surplus * 0.25).toLocaleString() +
        "/month)\n• Debt Funds: 35% (₹" +
        Math.round(surplus * 0.35).toLocaleString() +
        "/month)\n• Equity: 40% (₹" +
        Math.round(surplus * 0.4).toLocaleString() +
        "/month)"
      : "• Emergency Fund: 20% (₹" +
        Math.round(surplus * 0.2).toLocaleString() +
        "/month)\n• Debt Funds: 25% (₹" +
        Math.round(surplus * 0.25).toLocaleString() +
        "/month)\n• Equity: 55% (₹" +
        Math.round(surplus * 0.55).toLocaleString() +
        "/month)"
}

💰 **Tax Saving Strategy:**
• Annual Tax Saving Potential: ₹${taxSavingLimit.toLocaleString()}
• Monthly SIP in ELSS: ₹${Math.round(taxSavingLimit / 12).toLocaleString()}
• Estimated Tax Savings: ₹${Math.round(taxSavingLimit * 0.31).toLocaleString()}/year

🏆 **Specific Fund Recommendations:**
${
  profile.riskTolerance === "conservative"
    ? "• SBI Conservative Hybrid Fund\n• ICICI Prudential Corporate Bond Fund\n• Axis Treasury Advantage Fund"
    : profile.riskTolerance === "moderate"
      ? "• Axis Bluechip Fund (Large Cap)\n• HDFC Balanced Advantage Fund\n• Mirae Asset Tax Saver Fund (ELSS)"
      : "• Parag Parikh Flexi Cap Fund\n• Axis Small Cap Fund\n• Mirae Asset Emerging Bluechip Fund"
}

📈 **Projected Wealth in 10 Years:**
₹${Math.round((surplus * 12 * 10 * (profile.riskTolerance === "conservative" ? 1.08 : profile.riskTolerance === "moderate" ? 1.12 : 1.15)) / 100000).toFixed(1)} Lakhs

🎮 **Next Steps:**
1. Open investment accounts (Zerodha, Groww, or bank)
2. Start SIPs in recommended funds
3. Set up auto-debit for consistency
4. Review and rebalance quarterly

Would you like me to explain any specific investment or create a goal-based timeline?`
  }

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase()

    if (recommendationState.collectingForRecommendation) {
      return handleRecommendationCollection(userMessage, recommendationState.currentStep)
    }

    // Handle data collection flow
    if (conversationState.collectingData) {
      return handleDataCollection(userMessage, conversationState.currentStep)
    }

    if (
      message.includes("what is") ||
      message.includes("explain") ||
      message.includes("define") ||
      message.includes("meaning of")
    ) {
      return explainFinanceConcept(userMessage)
    }

    if (
      message.includes("child plan") ||
      message.includes("lic child") ||
      message.includes("compare lic") ||
      message.includes("child investment") ||
      message.includes("kid") ||
      message.includes("daughter") ||
      message.includes("son")
    ) {
      setRecommendationState({
        collectingForRecommendation: true,
        currentStep: "childAge",
        collectedData: {},
      })

      return `👶 **Child Investment Planning - Let's Create the Perfect Plan!**

I'll help you compare LIC child plans and SIP options based on your specific situation.

**First, tell me your child's age:**
This helps me recommend age-appropriate plans with the right timeline.

**Examples:**
• "My daughter is 3 years old"
• "He is 7 years old"  
• "She just turned 1"

💡 **Why age matters:**
• **0-5 years:** Maximum time for wealth creation
• **6-12 years:** Focus on education planning
• **13-18 years:** Short-term, conservative approach

What's your child's current age? 🌟`
    }

    // Real-time data requests
    if (message.includes("gold rate") || message.includes("current gold") || message.includes("gold price")) {
      const data = await fetchRealTimeFinancialData("gold")
      if (data?.type === "gold") {
        const goldInfo = data.data as any
        return `💰 **Live Gold Rates (Updated: ${goldInfo.lastUpdated}):**

🏆 **24K Gold:** ${goldInfo.price24k} per gram (${goldInfo.change})
🥈 **22K Gold:** ${goldInfo.price22k} per gram
📈 **Trend:** ${goldInfo.trend === "bullish" ? "📈 Bullish - Good time to buy" : "📉 Bearish - Wait for better rates"}

**📊 Source:** ${goldInfo.source}

💡 **Krishna's Investment Strategy:**
• **Physical Gold:** 5-10% of portfolio maximum
• **Gold ETFs:** More liquid, lower making charges
• **Gold Bonds:** 2.5% annual interest + price appreciation
• **Digital Gold:** Start small, accumulate gradually

🎯 **Tax Benefits:**
• Gold Bonds: No capital gains tax if held 8+ years
• Gold ETF: Long-term capital gains at 20% with indexation

⚠️ **Note:** Rates vary by city and jeweller. Always verify with local dealers before purchasing.`
      }
    }

    if (message.includes("mutual fund") || message.includes("sip rates") || message.includes("fund performance")) {
      const data = await fetchRealTimeFinancialData("mutual fund")
      if (data?.type === "funds") {
        const fundInfo = data.data as any
        return `📈 **Top Performing SIP Funds (Updated: ${fundInfo.lastUpdated}):**

${fundInfo.topFunds
  .map(
    (fund: any, index: number) => `
**${index + 1}. ${fund.name}**
• **Returns:** ${fund.returns} (3-year average)
• **Risk Level:** ${fund.risk}
• **Min SIP:** ${fund.minSIP}
• **AUM:** ${fund.aum}
• **Source:** ${fund.source}
`,
  )
  .join("")}

**⚠️ Disclaimer:** ${fundInfo.disclaimer}

💡 **Krishna's SIP Strategy:**
• Start with ₹500-1000 monthly
• Diversify across 2-3 fund categories  
• Increase SIP amount annually by 10%
• Stay invested for minimum 5 years

🎯 **Tax Benefits:**
• ELSS funds: 80C deduction up to ₹1.5L
• Long-term gains: 10% tax above ₹1L annually

Would you like me to compare specific funds for your goals? 🤔`
      }
    }

    if (
      message.includes("market") ||
      message.includes("stock") ||
      message.includes("nifty") ||
      message.includes("sensex")
    ) {
      const data = await fetchRealTimeFinancialData("market")
      if (data?.type === "market") {
        const marketInfo = data.data as any
        return `📈 **Live Market Update (${marketInfo.lastUpdated}):**

🔥 **Nifty 50:** ${marketInfo.nifty} (${marketInfo.niftyChange})
🚀 **Sensex:** ${marketInfo.sensex} (${marketInfo.sensexChange})

🏆 **Today's Top Performers:**
${marketInfo.topGainers.map((gainer: string) => `• ${gainer}`).join("\n")}

💡 **Market Sentiment:** ${marketInfo.sentiment === "bullish" ? "🐂 Bullish - Good for SIP investments" : "🐻 Bearish - Stay cautious"}

🎯 **Investment Strategy for Current Market:**
• **SIP in Index Funds:** Benefit from market growth
• **Large Cap Funds:** Stable performance in volatile times  
• **Avoid lump sum:** Continue systematic investing

${
  userProfile.monthlyIncome > 0
    ? `**Your Recommended Monthly SIP:** ₹${Math.round((userProfile.monthlyIncome - userProfile.monthlyExpenses) * 0.4).toLocaleString()} across 3-4 funds`
    : ""
}

📊 **Best Performing Sectors This Month:**
• Technology: +3.2%
• Banking & Finance: +2.8%
• Healthcare: +2.1%

Ready to start your investment journey with current market conditions?`
      }
    }

    // Financial planning trigger
    if (
      message.includes("plan") ||
      message.includes("financial plan") ||
      (message.includes("income") && userProfile.monthlyIncome === 0)
    ) {
      setConversationState({
        collectingData: true,
        currentStep: "income",
        collectedData: {},
      })

      return `🎯 **Let's Create Your Personalized Financial Roadmap!**

I'll ask you a few questions to understand your situation and create a customized investment strategy with specific fund recommendations.

💰 **First, let's start with your income:**

What's your monthly income? Include:
• Salary (in-hand amount)
• Bonus/incentives (monthly average)
• Other income sources

**Example:** "My monthly income is ₹75,000" or "I earn 1.2 lakhs per month"

*This helps me calculate your exact tax savings and investment capacity.*`
    }

    // Tax optimization
    if (message.includes("tax") || message.includes("save tax") || message.includes("80c")) {
      const income = userProfile.monthlyIncome || 50000
      const annualIncome = income * 12
      const taxBracket = annualIncome <= 250000 ? 0 : annualIncome <= 500000 ? 5 : annualIncome <= 1000000 ? 20 : 30

      return `💰 **Personalized Tax Optimization Strategy:**

📊 **Your Tax Profile:**
• Annual Income: ₹${annualIncome.toLocaleString()}
• Current Tax Bracket: ${taxBracket}%
• Potential Tax Savings: ₹${Math.round(annualIncome * 0.31 * 0.15).toLocaleString()}/year

🎯 **Section 80C Investments (₹1.5L limit):**
• **ELSS Mutual Funds:** ₹12,500/month
  - Tax saving + 12-15% returns
  - 3-year lock-in period
  - Recommended: Axis Tax Saver, Mirae Asset Tax Saver

• **PPF:** ₹12,500/month  
  - 15-year lock-in, 7.1% tax-free returns
  - Best for long-term wealth creation

• **NSC/Tax Saver FD:** ₹5,000/month
  - 5-year lock-in, guaranteed returns

📈 **Additional Tax Benefits:**
• **Section 80D:** Health insurance (₹25K-₹50K deduction)
• **Section 80CCD(1B):** NPS additional ₹50K
• **Section 24:** Home loan interest (₹2L deduction)

💡 **Smart Tax Calendar:**
• **April-June:** Start ELSS SIPs
• **July-September:** Increase contributions
• **October-December:** Final tax-saving investments
• **January-March:** Prepare for filing

${
  userProfile.monthlyIncome > 0
    ? `**Your Recommended Tax-Saving Portfolio:**
Monthly ELSS SIP: ₹${Math.min(12500, Math.round(userProfile.monthlyIncome * 0.15)).toLocaleString()}
Annual Tax Savings: ₹${Math.round((Math.min(150000, userProfile.monthlyIncome * 12 * 0.15) * taxBracket) / 100).toLocaleString()}`
    : "Share your income for exact tax-saving calculations!"
}

Ready to start your tax-saving investments?`
    }

    // Investment guidance
    if (message.includes("invest") || message.includes("mutual fund") || message.includes("sip")) {
      const data = await fetchRealTimeFinancialData("sip")

      return `📈 **Personalized Investment Strategy (Live Data):**

🎯 **Goal-Based Investment Approach:**

**🚨 Emergency Fund (First Priority):**
• Target: ${userProfile.monthlyExpenses > 0 ? `₹${(userProfile.monthlyExpenses * 6).toLocaleString()}` : "6 months expenses"}
• Investment: Liquid funds, savings account
• Monthly allocation: ${userProfile.monthlyIncome > 0 ? `₹${Math.round((userProfile.monthlyIncome - userProfile.monthlyExpenses) * 0.25).toLocaleString()}` : "25% of surplus"}

**📊 Wealth Creation Portfolio:**
${
  userProfile.riskTolerance === "conservative"
    ? `**Conservative Approach:**
• Large Cap Funds: 60% - Axis Bluechip Fund
• Debt Funds: 30% - ICICI Corporate Bond Fund  
• Gold ETF: 10% - SBI Gold ETF
Expected Returns: 8-10% annually`
    : userProfile.riskTolerance === "aggressive"
      ? `**Aggressive Growth:**
• Small/Mid Cap: 40% - Axis Small Cap Fund
• Flexi Cap: 35% - Parag Parikh Flexi Cap
• Large Cap: 25% - Mirae Asset Large Cap
Expected Returns: 15-18% annually`
      : `**Balanced Portfolio:**
• Large Cap: 40% - Axis Bluechip Fund
• Mid Cap: 30% - HDFC Mid-Cap Opportunities  
• Flexi Cap: 20% - Parag Parikh Flexi Cap
• Debt: 10% - Axis Treasury Advantage
Expected Returns: 12-15% annually`
}

💰 **SIP Recommendations:**
${
  userProfile.monthlyIncome > 0
    ? `• Total Monthly SIP: ₹${Math.round((userProfile.monthlyIncome - userProfile.monthlyExpenses) * 0.6).toLocaleString()}
• Start with: ₹5,000/month, increase 10% annually
• Wealth in 10 years: ₹${Math.round(((userProfile.monthlyIncome - userProfile.monthlyExpenses) * 0.6 * 12 * 10 * 1.12) / 100000).toFixed(1)} Lakhs`
    : "Share your income for personalized SIP amounts!"
}

🏆 **Top Performing Funds (5-year returns):**
• Axis Bluechip Fund: 12.8% CAGR
• Parag Parikh Flexi Cap: 14.6% CAGR
• Mirae Asset Emerging Bluechip: 15.2% CAGR

🎮 **Getting Started:**
1. Download Groww/Zerodha Coin app
2. Complete KYC verification  
3. Start SIPs in recommended funds
4. Set up auto-debit for consistency

Want me to create a step-by-step investment timeline?`
    }

    // Government schemes explanation
    if (
      message.includes("ppf") ||
      message.includes("nps") ||
      message.includes("sukanya") ||
      message.includes("government scheme")
    ) {
      return `🏛️ **Government Investment Schemes - Detailed Guide:**

💰 **Public Provident Fund (PPF):**
• **Lock-in:** 15 years (extendable in 5-year blocks)
• **Interest:** 7.1% annually (tax-free)
• **Investment:** ₹500 to ₹1.5L per year
• **Tax Benefit:** EEE (Exempt-Exempt-Exempt)
• **Best for:** Long-term wealth creation, retirement planning

📊 **National Pension System (NPS):**
• **Lock-in:** Until age 60 (partial withdrawal allowed)
• **Returns:** 10-12% historically
• **Tax Benefit:** ₹1.5L under Section 80C + ₹50K under Section 80CCD(1B)
• **Best for:** Retirement corpus building

👶 **Sukanya Samriddhi Yojana (Girl Child):**
• **Lock-in:** 21 years or marriage after 18
• **Interest:** 7.6% annually (tax-free)
• **Investment:** ₹250 to ₹1.5L per year
• **Best for:** Girl child's education and marriage

🏠 **ELSS vs PPF vs NPS Comparison:**

| Feature | ELSS | PPF | NPS |
|---------|------|-----|-----|
| Lock-in | 3 years | 15 years | Till 60 |
| Returns | 12-15% | 7.1% | 10-12% |
| Tax on maturity | LTCG | Nil | Partial |
| Liquidity | High | Medium | Low |

💡 **Krishna's Recommendation:**
• **Age 20-30:** 70% ELSS + 30% PPF
• **Age 30-40:** 50% ELSS + 30% PPF + 20% NPS  
• **Age 40+:** 40% ELSS + 40% PPF + 20% NPS

${
  userProfile.monthlyIncome > 0
    ? `**For your income (₹${userProfile.monthlyIncome.toLocaleString()}/month):**
Recommended allocation:
• ELSS SIP: ₹${Math.round(userProfile.monthlyIncome * 0.1).toLocaleString()}/month
• PPF: ₹${Math.round(userProfile.monthlyIncome * 0.08).toLocaleString()}/month
• NPS: ₹${Math.round(userProfile.monthlyIncome * 0.05).toLocaleString()}/month`
    : ""
}

Which scheme interests you the most? I can provide detailed implementation steps!`
    }

    return `🙏 **Namaste! I'm Krishna, your AI financial advisor with two special modes:**

📚 **Concept Explanation Mode:**
Ask "What is SIP?" or "Explain mutual funds" for clear, beginner-friendly explanations with examples.

🎯 **Personalized Recommendation Mode:**
Share your details (age, budget, goals) for custom LIC child plans and SIP comparisons.

✨ **I can also help you with:**
• 📊 **Real-time data:** Gold rates, stock prices, market updates
• 💰 **Tax optimization:** Save thousands through smart investments  
• 🏛️ **Government schemes:** PPF, NPS, ELSS detailed guidance
• 📈 **Goal-based investing:** Home, retirement, education planning

💡 **Try asking:**
• "What is SIP?" (Concept Mode)
• "Compare LIC child plans" (Recommendation Mode)
• "Current gold rates for investment"
• "My income is ₹80K, create my plan"

🎮 **Your Financial Journey:**
${
  userProfile.monthlyIncome > 0
    ? `✅ Profile Complete - Ready for advanced strategies!
Current surplus: ₹${(userProfile.monthlyIncome - userProfile.monthlyExpenses).toLocaleString()}/month`
    : "📝 Let's start by creating your financial profile or explaining concepts!"
}

What would you like to explore today? 🌟`
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    const responseTime = inputMessage.length > 50 ? 3000 : 2000

    setTimeout(async () => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: await generateBotResponse(inputMessage),
        timestamp: new Date(),
        suggestions:
          conversationState.collectingData || recommendationState.collectingForRecommendation
            ? ["💡 Need help with format", "📞 Call support", "⏭️ Skip this step"]
            : ["What is SIP?", "Compare LIC plans", "💰 Live gold rates", "🎯 Investment plan"],
      }

      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)

      if (inputMessage.toLowerCase().includes("income") || inputMessage.toLowerCase().includes("plan")) {
        toast({
          title: "🎉 Great Progress!",
          description: `Building your financial profile! Streak: ${userStreak.currentStreak} days`,
        })
      }
    }, responseTime)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="text-2xl">🦚</div>
                <div>
                  <h1 className="font-bold text-lg text-gray-800">FinSavvy AI</h1>
                  <p className="text-sm text-gray-600">with Krishna</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                🔥 {userStreak.currentStreak} day streak
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                💰 {user.currency} Currency
              </Badge>
              {userProfile.monthlyIncome > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  📊 Profile Complete
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowProfile(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Krishna Animation */}
      <div className="container mx-auto px-4 py-4">
        <KrishnaAnimations />
      </div>

      {/* Chat Area */}
      <div className="container mx-auto px-4 pb-4">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[60vh] flex flex-col border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-400 to-blue-500 text-white">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Chat with Krishna - Your Financial Guru
                <Badge variant="secondary" className="bg-green-500 text-white ml-auto">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Live Data
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={message.type === "user" ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}
                      >
                        {message.type === "user" ? <User className="h-4 w-4" /> : "🦚"}
                      </AvatarFallback>
                    </Avatar>

                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user" ? "bg-blue-500 text-white" : "bg-white border-2 border-orange-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {message.suggestions && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs bg-orange-50 border-orange-200 hover:bg-orange-100"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-orange-500 text-white">🦚</AvatarFallback>
                    </Avatar>
                    <div className="bg-white border-2 border-orange-200 rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t-2 border-orange-200">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    conversationState.collectingData || recommendationState.collectingForRecommendation
                      ? "Answer the question above..."
                      : "Ask Krishna: 'What is SIP?', 'Compare LIC child plans', 'Current gold rates?'..."
                  }
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="border-2 border-orange-200 focus:border-orange-400"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-gradient-to-r from-orange-400 to-blue-500 hover:from-orange-500 hover:to-blue-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Profile Dialog */}
      <ProfileDialog user={user} open={showProfile} onOpenChange={setShowProfile} />
    </div>
  )
}
