"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, Plus } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function UploadReportForm({ onUploadReport }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()
  const [formData, setFormData] = useState({
    Section: "",
    Submitted_By: "",
    Leadership_Viewed: "No",
    Feedback: "",
    Changed_Since_Last_Week: "New report",
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!date || !formData.Section || !formData.Submitted_By) {
      return // Basic validation
    }

    const newReport = {
      ...formData,
      Report_Date: format(date, "yyyy-MM-dd"),
    }

    onUploadReport(newReport)
    setOpen(false)

    // Reset form
    setDate(undefined)
    setFormData({
      Section: "",
      Submitted_By: "",
      Leadership_Viewed: "No",
      Feedback: "",
      Changed_Since_Last_Week: "New report",
    })
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload New Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Report</DialogTitle>
          <DialogDescription>Add a new report to the tracking system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Report Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="section">Section</Label>
            <Select value={formData.Section} onValueChange={(value) => handleChange("Section", value)}>
              <SelectTrigger id="section">
                <SelectValue placeholder="Select section" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Team morale pulse">Team morale pulse</SelectItem>
                <SelectItem value="Project status">Project status</SelectItem>
                <SelectItem value="Risk assessment">Risk assessment</SelectItem>
                <SelectItem value="Blockers">Blockers</SelectItem>
                <SelectItem value="Wins">Wins</SelectItem>
                <SelectItem value="Resource needs">Resource needs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="submitter">Submitted By</Label>
            <Input
              id="submitter"
              value={formData.Submitted_By}
              onChange={(e) => handleChange("Submitted_By", e.target.value)}
              placeholder="Your name or ID"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="leadership">Leadership Viewed</Label>
            <Select
              value={formData.Leadership_Viewed}
              onValueChange={(value) => handleChange("Leadership_Viewed", value)}
            >
              <SelectTrigger id="leadership">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="feedback">Feedback</Label>
            <Textarea
              id="feedback"
              value={formData.Feedback}
              onChange={(e) => handleChange("Feedback", e.target.value)}
              placeholder="Any feedback on this report"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="changes">Changes Since Last Week</Label>
            <Select
              value={formData.Changed_Since_Last_Week}
              onValueChange={(value) => handleChange("Changed_Since_Last_Week", value)}
            >
              <SelectTrigger id="changes">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New report">New report</SelectItem>
                <SelectItem value="Updated">Updated</SelectItem>
                <SelectItem value="Reworded">Reworded</SelectItem>
                <SelectItem value="Major revision">Major revision</SelectItem>
                <SelectItem value="Minor changes">Minor changes</SelectItem>
                <SelectItem value="No change">No change</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit">Upload Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
