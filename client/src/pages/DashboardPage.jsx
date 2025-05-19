"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  BarChart3,
  Users,
  Calendar,
  Plus,
  IndianRupee,
  Eye,
  Trash,
  Pencil,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { formatCurrency } from "../lib/utils";
import axios from "axios";
import toast from "react-hot-toast";

const apiUrl = import.meta.env.VITE_API_URL;
const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState({
    events: [],
    totalParticipants: 0,
    totalCollection: 0,
  });

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/getEventsByOwner`, {
        withCredentials: true,
      });

      setEventData({
        events: response.data.events,
        totalParticipants: response.data.totalParticipants,
        totalCollection: response.data.totalCollection,
      });
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`${apiUrl}/event/${eventId}`, {
        withCredentials: true,
      });
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your events and track payments
          </p>
        </div>
        <Button asChild>
          <Link to="/create-event">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{eventData.events.length}</div>
            <p className="text-xs text-muted-foreground">
              Events you&apos;ve created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventData.totalParticipants}
            </div>
            <p className="text-xs text-muted-foreground">
              People registered across all events
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Collected
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(eventData.totalCollection)}
            </div>
            <p className="text-xs text-muted-foreground">
              Funds collected across all events
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Events</h2>
        <div className="space-y-4">
          {eventData.events.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent className="pt-4">
                <p className="mb-4">You haven&apos;t created any events yet.</p>
                <Button asChild>
                  <Link to="/create-event">Create Your First Event</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            eventData.events.map((event, index) => (
              <Card
                key={event._id || event.id || index}
                className={
                  ["completed", "cancelled"].includes(event.status)
                    ? "opacity-70"
                    : ""
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription>
                        {(() => {
                          const dateObj = new Date(event.date);
                          const [hours, minutes] = event.time
                            .split(":")
                            .map(Number);
                          dateObj.setHours(hours);
                          dateObj.setMinutes(minutes);

                          return dateObj.toLocaleString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          });
                        })()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      {event.status === "upcoming" && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 font-medium">
                          Upcoming
                        </span>
                      )}
                      {event.status === "ongoing" && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 font-medium">
                          Ongoing
                        </span>
                      )}
                      {event.status === "completed" && (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-500 font-medium">
                          Completed
                        </span>
                      )}
                      {event.status === "cancelled" && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-500 font-medium">
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Participants Registered
                      </span>
                      <span className="font-medium">
                        {event.totalParticipants}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Collected
                      </span>
                      <span className="font-medium">
                        {formatCurrency(event.totalCollection)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Fee</span>
                      <span className="font-medium">
                        {formatCurrency(event.fee)}
                      </span>
                    </div>
                      <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Category
                      </span>
                      <span className="font-medium">
                       {event.category}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/event/${event._id}`}>
                        {" "}
                        <Eye className="mr-2 h-4 w-4" />
                        View Event
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/transparency/${event.id}`}>
                        <BarChart3 className="mr-2 h-4 w-4" /> Fund Details
                      </Link>
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link
                        to={`/event/edit/${event._id}`}
                        className="group border-blue-400 text-blue-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Update Details
                      </Link>
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group border-red-400 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                        >
                          <Trash className="mr-2 h-4 w-4 text-red-400 group-hover:text-red-600" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you absolutely sure?</DialogTitle>
                          <DialogDescription>
                            This will permanently remove this event and all
                            associated data.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="secondary">
                              Close
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(event._id)}
                          >
                            Confirm Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
