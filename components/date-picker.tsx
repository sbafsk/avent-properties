"use client"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { GlassCard } from "./glass-card"
import { CalendarDays, Clock } from "lucide-react"

interface DatePickerProps {
  selectedDate: Date | undefined
  onDateSelect: (date: Date | undefined) => void
  selectedTime: string
  onTimeSelect: (time: string) => void
}

export function DatePicker({ selectedDate, onDateSelect, selectedTime, onTimeSelect }: DatePickerProps) {
  const timeSlots = ["09:00 AM", "10:30 AM", "12:00 PM", "01:30 PM", "03:00 PM", "04:30 PM"]

  // Disable past dates and weekends for luxury service
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 // Disable Sundays
  }

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarDays className="h-5 w-5 text-gold" />
          <h3 className="heading-luxury text-lg text-foreground">Select Tour Date</h3>
        </div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          disabled={isDateDisabled}
          className="rounded-md border-0"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-foreground",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground hover:text-gold",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gold/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-gold/20 hover:text-gold rounded-md transition-colors",
            day_selected:
              "bg-gold text-gold-foreground hover:bg-gold hover:text-gold-foreground focus:bg-gold focus:text-gold-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50 cursor-not-allowed",
            day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
          }}
        />
      </GlassCard>

      {selectedDate && (
        <GlassCard className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gold" />
            <h3 className="heading-luxury text-lg text-foreground">Select Time</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {timeSlots.map((time) => (
              <Button
                key={time}
                variant={selectedTime === time ? "default" : "outline"}
                onClick={() => onTimeSelect(time)}
                className={
                  selectedTime === time
                    ? "bg-gold text-gold-foreground"
                    : "glass border-white/20 text-foreground hover:border-gold hover:text-gold"
                }
              >
                {time}
              </Button>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  )
}
