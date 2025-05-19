"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Image, IndianRupee, LinkIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { apiUrl } from "@/lib/config";

const categories = [
  "Music",
  "Technology",
  "Business",
  "Sports",
  "Art",
  "Education",
];

const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .nonempty("Title is required")
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .nonempty("Description is required")
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must not exceed 1000 characters"),

  category: z
    .string()
    .min(1, "Category is required")
    .refine((val) => val.trim() !== "", { message: "Category cannot be empty" }),

  date: z.date({
    required_error: "Event date is required",
    invalid_type_error: "Invalid date format",
  }),

  time: z
    .string()
    .nonempty("Time is required")
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
      message: "Invalid time format (HH:mm)",
    }),

  location: z
    .string()
    .trim()
    .nonempty("Location is Required")
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must not exceed 200 characters"),

  fee: z
    .string()
    .trim()
    .nonempty("Fee is Required")
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, {
      message: "Fee must be a valid non-negative number",
    }),

  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true;
        return (
          file instanceof File &&
          ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type) &&
          file.size <= 5 * 1024 * 1024
        );
      },
      {
        message: "Image must be a JPG, PNG, or WEBP under 5MB",
      }
    ),
});


const CreateEvent = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      date: undefined,
      time: "",
      location: "",
      fee: "",
      image: undefined,
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("image", file);
    } else {
      setPreview(null);
      form.setValue("image", undefined);
      if (error) setError("");
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const payload = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "image") {
        if (key === "fee") {
          payload.append("fee", Number(value));
        } else if (key === "date") {
          payload.append("date", value.toISOString());
        } else {
          payload.append(key, value);
        }
      }
    });
    if (values.image) payload.append("image", values.image);

    try {
      const res = await axios.post(`${apiUrl}/createEvent`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.event) navigate(`/event/${res.data.event._id}`);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Create a New Event
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your event page.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Annual Team Retreat" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Provide details about your event..."
                        className=" resize-none flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="Venue address or online link" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? format(field.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fee */}
              <FormField
                control={form.control}
                name="fee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participation Fee (₹)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

                        <Input
                          type="number"
                          min="0"
                          placeholder="1000"
                          className="pl-10"
                          {...field}
                          onWheel={(e) => e.currentTarget.blur()}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image */}
              <div className="space-y-2">
                <FormLabel>Event Image (Optional)</FormLabel>

                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="file"
                    accept="image/*"
                    className="pl-10"
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Select image for your event. Leave blank to use a default image.
                </p>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 h-40 w-40 object-cover rounded border"
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
              {loading ? "Creating Event..." : "Create Event"}
            </Button>
          </CardFooter>
          </form>
        </Form>
      </Card>
      {error && (
        <div className="my-2 p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      {/* Share Link Placeholder */}
      <div className="mt-8 p-6 bg-primary/5 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <LinkIcon className="mr-2 h-5 w-5" /> Shareable Link
        </h3>
        <p className="text-muted-foreground mb-4">
          After creating your event, you &apos;ll get a unique link to share
          with participants.
        </p>
        <div className="bg-primary/10 p-3 rounded-md text-center text-muted-foreground">
          Your event link will appear here after creation
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
