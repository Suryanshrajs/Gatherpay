"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Calendar, Clock, MapPin, Users, Share2, CreditCard, Tags } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { formatCurrency, formatDate, loadRazorpay } from "../lib/utils"
import axios from "axios"
import { imageUrl, razorpayKey } from "@/lib/config"
import { useAuth } from "@/context/AuthContext"
import toast from "react-hot-toast"
const apiUrl = import.meta.env.VITE_API_URL

const EventDetailsPage = () => {
  const { eventId } = useParams()
  const { userInfo } = useAuth();
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${apiUrl}/event/${eventId}`, { withCredentials: true });
        setEvent(response.data.event);
      } catch (error) {
        console.error("Error fetching event:", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Join me at ${event.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleLoginRedirect = () => {
    sessionStorage.setItem("payAfterLogin", "true");
    sessionStorage.setItem("redirectEvent", eventId);
    navigate("/login", { state: { from: window.location.pathname } });
  };
const handlePaymentSuccess = () => {
  navigate("/thank-you", { replace: true });
};
useEffect(() => {
  const payFlag = sessionStorage.getItem("payAfterLogin");
  const storedEventId = sessionStorage.getItem("redirectEvent");

  if (userInfo && payFlag === "true" && storedEventId === eventId && event) {
    sessionStorage.removeItem("payAfterLogin");
    sessionStorage.removeItem("redirectEvent");
    handlePayment();
  }
}, [userInfo, event, eventId]);


  const handlePayment = async () => {
  const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      toast.error("Failed to load Razorpay SDK.");
      return;
    }

    try {
      const { data } = await axios.post(`${apiUrl}/create-order`, {
        amount: event.fee,
        eventId: event._id,
        userId: userInfo._id,
      }, {
        withCredentials: true,
      });

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: "INR",
        name: "Event Payment",
        description: `Payment for event: ${event.title}`,
        order_id: data.order.id,
        handler: async function (response) {

          const verifyRes = await axios.post(
            `${apiUrl}/verify-payment`,
            {
              ...response,
              eventId: event._id,
              userId: userInfo._id,
              amount: event.fee,
            },
            { withCredentials: true }
          );

          if (verifyRes.data.success) {
            toast.success("Payment successful! 🎉");
            handlePaymentSuccess();
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#6366f1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Error in payment", error);
      alert("Payment failed. Please try again.");
    }
  };

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
        <p className="mb-6">The event you&apos;re looking for doesn &apos;t exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative rounded-xl overflow-hidden mb-8 h-64 md:h-80">
        <img
          src={
            event.image
              ? `${imageUrl}/${event.image}`
              : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnR8ZW58MHx8MHx8fDA%3D"
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
          <div className="p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
            <p className="text-blue-200">Organized by {event.organizer.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>About This Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{event.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transparency Dashboard</CardTitle>
              <CardDescription>See how funds are being allocated</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-md">
                <span>Total Collected</span>
                <span className="font-semibold">{formatCurrency(event.totalCollection)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-md">
                <span>Number of Participants</span>
                <span className="font-semibold">{event.totalParticipants}</span>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/transparency/${event._id}`}>View Detailed Breakdown</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-muted-foreground">{formatDate(event.date)}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Time</p>
                  <p className="text-muted-foreground">
                    {new Date(`2000-01-01T${event.time}`).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">{event.location}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Tags className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-muted-foreground">{event.category}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Users className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <p className="font-medium">Participants</p>
                  <p className="text-muted-foreground">{event.totalParticipants} registered</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-3">
              <Button className="w-full" onClick={userInfo ? handlePayment : handleLoginRedirect}>
                <CreditCard className="mr-2 h-4 w-4" />
                {userInfo ? `Pay ${formatCurrency(event.fee)}` : "Login to Pay"}
              </Button>
              <Button variant="outline" className="w-full" onClick={handleShareEvent}>
                <Share2 className="mr-2 h-4 w-4" /> Share Event
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you have any questions about this event, please contact the organizer directly.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Contact Organizer
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage

