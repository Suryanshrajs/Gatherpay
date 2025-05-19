
import { Link } from "react-router-dom"
import { ArrowRight, Calendar, CreditCard, BarChart3, Shield } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { useAuth } from "../context/AuthContext"


const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Simplify Event Payments with GatherPay
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
          Create events, collect fees, and manage funds with complete transparency.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/create-event">Create an Event</Link>
          </Button>
          {!isAuthenticated && (
            <Button size="lg" variant="outline" asChild>
              <Link to="/register">Sign Up Free</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <Calendar className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Event Web Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create customized event pages with all the details and registration options.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CreditCard className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Seamless Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Integrated Razorpay gateway for smooth and secure fee collection.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Real-time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Monitor incoming payments and withdrawals in real-time.</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Secure & Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Encrypted transactions with complete transparency in fund allocation.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-primary/5 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your Event</h3>
            <p className="text-muted-foreground">Set up your event page with all details and payment requirements.</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
            <p className="text-muted-foreground">Distribute your unique event link to all participants.</p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Collect & Manage</h3>
            <p className="text-muted-foreground">Receive payments and manage funds with complete transparency.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-900 to-indigo-900 border-none">
          <CardHeader>
            <CardTitle className="text-3xl text-white">Ready to simplify your event payments?</CardTitle>
            <CardDescription className="text-blue-200">
              Join thousands of event organizers who trust GatherPay
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center pb-8">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-100" asChild>
              <Link to="/register">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}

export default HomePage

