
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Booking, BookingType } from '@/types';
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const bookingTypes: { value: BookingType; label: string }[] = [
  { value: 'flight', label: 'Flight' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'car', label: 'Car Rental' },
  { value: 'activity', label: 'Activity' },
  { value: 'other', label: 'Other' },
];

const formSchema = z.object({
  type: z.enum(['flight', 'hotel', 'car', 'activity', 'other'] as const),
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.date(),
  startTime: z.string().optional(),
  endDate: z.date().optional(),
  endTime: z.string().optional(),
  confirmationNumber: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditBookingFormProps {
  booking: Booking;
  onSave: (booking: Booking) => void;
}

const EditBookingForm: React.FC<EditBookingFormProps> = ({ booking, onSave }) => {
  // Parse dates and times from the booking
  const startDate = booking.startDate ? new Date(booking.startDate) : new Date();
  const endDate = booking.endDate ? new Date(booking.endDate) : undefined;
  
  // Extract time from dates if they exist
  const getTimeFromDate = (dateString?: string): string => {
    if (!dateString || !dateString.includes('T')) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const startTime = getTimeFromDate(booking.startDate);
  const endTime = getTimeFromDate(booking.endDate);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: booking.type,
      title: booking.title,
      description: booking.description || "",
      location: booking.location || "",
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
      confirmationNumber: booking.confirmationNumber || "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Combine date and time for start date
    let combinedStartDate = new Date(values.startDate);
    if (values.startTime) {
      const [hours, minutes] = values.startTime.split(':').map(Number);
      combinedStartDate.setHours(hours || 0, minutes || 0);
    }

    // Combine date and time for end date if it exists
    let combinedEndDate: Date | undefined = undefined;
    if (values.endDate) {
      combinedEndDate = new Date(values.endDate);
      if (values.endTime) {
        const [hours, minutes] = values.endTime.split(':').map(Number);
        combinedEndDate.setHours(hours || 0, minutes || 0);
      }
    }

    const updatedBooking: Booking = {
      ...booking,
      type: values.type,
      title: values.title,
      description: values.description,
      location: values.location,
      startDate: combinedStartDate.toISOString(),
      endDate: combinedEndDate ? combinedEndDate.toISOString() : undefined,
      confirmationNumber: values.confirmationNumber,
    };
    
    onSave(updatedBooking);
    toast.success("Booking updated successfully");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Type</FormLabel>
                <FormControl>
                  <select
                    className="w-full p-2 border rounded-md bg-white text-gray-800"
                    {...field}
                  >
                    {bookingTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Booking title" {...field} className="bg-white text-gray-800" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700">Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">Start Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      placeholder="HH:MM"
                      {...field}
                      className="bg-white text-gray-800"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-gray-700">End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal bg-white",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700">End Time</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <Input
                      type="time"
                      placeholder="HH:MM"
                      {...field}
                      className="bg-white text-gray-800"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Location</FormLabel>
              <FormControl>
                <Input placeholder="Location (optional)" {...field} className="bg-white text-gray-800" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Confirmation Number</FormLabel>
              <FormControl>
                <Input placeholder="Confirmation number (optional)" {...field} className="bg-white text-gray-800" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description (optional)"
                  className="resize-none bg-white text-gray-800"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <DialogClose asChild>
            <Button variant="outline" type="button" className="bg-white text-gray-800">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

export default EditBookingForm;
