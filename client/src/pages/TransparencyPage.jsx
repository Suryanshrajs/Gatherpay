"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Download, PieChart, DollarSign, CreditCard, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { formatCurrency } from "../lib/utils"

const TransparencyPage = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // This is a mock implementation
    setTimeout(() => {
      setEvent({
        id: eventId,
        title: "Annual Company Retreat 2023",
        date: "2023-12-15",
        totalCollected: 105000,
        participants: 42,
        feePerPerson: 2500,
        expenses: [
          { category: "Venue Booking", amount: 45000 },
          { category: "Food & Beverages", amount: 30000 },
          { category: "Transportation", amount: 15000 },
          { category: "Activities", amount: 10000 },
          { category: "Miscellaneous", amount: 5000 },
        ],
        recentTransactions: [
          { name: "Rahul Kumar", amount: 2500, date: "2023-11-10" },
          { name: "Priya Sharma", amount: 2500, date: "2023-11-09" },
          { name: "Amit Singh", amount: 2500, date: "2023-11-08" },
          { name: "Neha Gupta", amount: 2500, date: "2023-11-07" },
          { name: "Vikram Patel", amount: 2500, date: "2023-11-06" },
        ],
      })
      setLoading(false)
    }, 1000)
  }, [eventId])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  // Calculate remaining funds
  const totalExpenses = event.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingFunds = event.totalCollected - totalExpenses

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/event/${eventId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <p className="text-muted-foreground">Financial Transparency Dashboard</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(event.totalCollected)}</div>
            <p className="text-xs text-muted-foreground">From {event.participants} participants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Across {event.expenses.length} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Funds</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(remainingFunds)}</div>
            <p className="text-xs text-muted-foreground">
              {((remainingFunds / event.totalCollected) * 100).toFixed(1)}% of total collected
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>How funds are being allocated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {event.expenses.map((expense, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{expense.category}</span>
                    <span className="font-medium">{formatCurrency(expense.amount)}</span>
                  </div>
                  <div className="w-full bg-primary/10 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${(expense.amount / event.totalCollected) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground text-right">
                    {((expense.amount / event.totalCollected) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Expense Report
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest payments received</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {event.recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-md">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{transaction.name}</p>
                      <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-medium">{formatCurrency(transaction.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Transparency Statement */}
      <Card className="mt-8 bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Transparency Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            This transparency dashboard is provided to ensure all participants have visibility into how their funds are
            being utilized. All expenses are documented and can be verified. If you have any questions about the
            financial details of this event, please contact the organizer directly.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Contact Organizer
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default TransparencyPage

