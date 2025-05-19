"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Clock, MapPin, Image, IndianRupee } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import axios from "axios";
import { apiUrl, imageUrl } from "@/lib/config";

const categories = [
  "Music",
  "Technology",
  "Business",
  "Sports",
  "Art",
  "Education",
];
const status = [
 "ongoing", "upcoming",  "completed", "cancelled"
]

export function UpdateEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    status: "",
    fee: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [hasUserSelectedImage, setHasUserSelectedImage] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${apiUrl}/event/${eventId}`, {
          withCredentials: true,
        });
        const event = res.data.event;
        setFormData({
          title: event.title,
          description: event.description,
          category: event.category,
          date: event.date?.slice(0, 10) || "",
          time: event.time || "",
          location: event.location || "",
          fee: event.fee.toString(),
          status: event.status,
        });
        if (!hasUserSelectedImage) {
          setPreview(`${imageUrl}/${event.image}`);
        }
      } catch (err) {
        setError("Failed to load event data.");
        console.log(err);
      }
    };

    fetchEvent();
  }, [eventId, hasUserSelectedImage]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
    if (error) setError("");
  };

   const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
    if (error) setError("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setHasUserSelectedImage(true);
    } else {
      setPreview(null);
      setHasUserSelectedImage(false);
    }
    setImageFile(file);
    if (error) setError("");
  };


  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { title, description, category, date, time, fee, location } =
      formData;

    if (!title?.trim()) {
      setError("Title is required.");
      setLoading(false);
      return;
    }

    if (!description?.trim()) {
      setError("Description is required.");
      setLoading(false);
      return;
    }

    if (!category?.trim()) {
      setError("Category is required.");
      setLoading(false);
      return;
    }

    if (!date || isNaN(new Date(date).getTime())) {
      setError("Please select a valid date.");
      setLoading(false);
      return;
    }

    if (!time?.trim()) {
      setError("Please select a time.");
      setLoading(false);
      return;
    }

    if (!location?.trim()) {
      setError("Location is required.");
      setLoading(false);
      return;
    }

    if (!fee || isNaN(fee)) {
      setError("Fee must be a valid number.");
      setLoading(false);
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "image") {
        if (key === "fee") {
          payload.append("fee", Number(value));
        } else {
          payload.append(key, value);
        }
      }
    });
    if (imageFile) {
      payload.append("image", imageFile);
    }

    try {
      const response = await axios.patch(
        `${apiUrl}/event/${eventId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.event) {
        navigate(`/event/${response.data.event._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Update Event Details
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Edit the information below to update your event details.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Event Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Event Title
              </label>
              <div className="relative">
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Annual Team Retreat"
                />
              </div>
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Event Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide details about your event..."
                className="flex min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Event Category
                </label>
                <Select
                  id="category"
                  name="category"
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Event Status
                </label>
                <Select
                  id="status"
                  name="status"
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {status.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Event Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Venue address or online link"
                  className="pl-10"
                />
              </div>
            </div>
            {/* Event Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Event Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${formData.date ? "" : "text-muted-foreground"
                        }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date
                        ? format(new Date(formData.date), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        formData.date ? new Date(formData.date) : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          setFormData((prev) => ({
                            ...prev,
                            date: format(date, "yyyy-MM-dd"),
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Event Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="time"
                    name="time"
                    type="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            {/* Participation Fee */}
            <div className="space-y-2">
              <label htmlFor="fee" className="text-sm font-medium">
                Participation Fee (₹)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fee"
                  name="fee"
                  type="number"
                  value={formData.fee}
                  onChange={handleChange}
                  placeholder="1000"
                  className="pl-10"
                  onWheel={(e) => e.currentTarget.blur()}
                  min="0"
                />
              </div>
            </div>

            {/* Event Image URL */}
            <div className="space-y-2">
              <label htmlFor="image" className="text-sm font-medium">
                Event Image
              </label>
              <div className="relative">
                <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="image"
                  type="file"
                  name="image"
                  accept="image/*"
                  className="pl-10"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Select a new image to replace the current one.
              </p>
              {preview && (
                <img
                  src={preview}
                  alt="Event Preview"
                  className="w-full h-64 object-cover rounded-md mb-2 border"
                />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating Event..." : "Update Event"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
