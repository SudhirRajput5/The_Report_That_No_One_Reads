"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, CheckCircle2, Clock, TrendingDown, TrendingUp } from "lucide-react"
import { fetchReportData } from "@/lib/data-service"
import { ReportMetrics } from "@/components/report-metrics"
import { UnreadReports } from "@/components/unread-reports"
import { ReportInsights } from "@/components/report-insights"
import { UploadReportForm } from "@/components/upload-report-form"

export function AutoReport() {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState<any>(null)
  const [metrics, setMetrics] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchReportData()
        setReportData(data)

        // Calculate metrics
        const totalReports = data.length
        const unreadReports = data.filter((r) => r.Leadership_Viewed === "No").length
        const readRate = ((totalReports - unreadReports) / totalReports) * 100

        // Get sections with most unread reports
        const sectionCounts = data.reduce((acc, report) => {
          if (report.Leadership_Viewed === "No") {
            acc[report.Section] = (acc[report.Section] || 0) + 1
          }
          return acc
        }, {})

        const topUnreadSections = Object.entries(sectionCounts)
          .sort((a, b) => (b[1] as number) - (a[1] as number))
          .slice(0, 3)
          .map(([section, count]) => ({ section, count }))

        // Get recent changes
        const recentChanges = data.filter((r) => r.Changed_Since_Last_Week !== "No change").slice(0, 5)

        // Calculate trend (simple version)
        const lastWeekData = data.filter((r) => {
          const reportDate = new Date(r.Report_Date)
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          return reportDate >= oneWeekAgo
        })

        const lastWeekUnread = lastWeekData.filter((r) => r.Leadership_Viewed === "No").length
        const lastWeekReadRate =
          lastWeekData.length > 0 ? ((lastWeekData.length - lastWeekUnread) / lastWeekData.length) * 100 : 0

        const trend = readRate > lastWeekReadRate ? "up" : "down"

        setMetrics({
          totalReports,
          unreadReports,
          readRate,
          topUnreadSections,
          recentChanges,
          trend,
        })

        setLoading(false)
      } catch (error) {
        console.error("Error loading report data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleUploadReport = (newReport) => {
    // Add the new report to the existing data
    const updatedReportData = [newReport, ...reportData]
    setReportData(updatedReportData)

    // Recalculate metrics
    const totalReports = updatedReportData.length
    const unreadReports = updatedReportData.filter((r) => r.Leadership_Viewed === "No").length
    const readRate = ((totalReports - unreadReports) / totalReports) * 100

    // Get sections with most unread reports
    const sectionCounts = updatedReportData.reduce((acc, report) => {
      if (report.Leadership_Viewed === "No") {
        acc[report.Section] = (acc[report.Section] || 0) + 1
      }
      return acc
    }, {})

    const topUnreadSections = Object.entries(sectionCounts)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 3)
      .map(([section, count]) => ({ section, count }))

    // Get recent changes
    const recentChanges = updatedReportData.filter((r) => r.Changed_Since_Last_Week !== "No change").slice(0, 5)

    // Calculate trend (simple version)
    const lastWeekData = updatedReportData.filter((r) => {
      const reportDate = new Date(r.Report_Date)
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return reportDate >= oneWeekAgo
    })

    const lastWeekUnread = lastWeekData.filter((r) => r.Leadership_Viewed === "No").length
    const lastWeekReadRate =
      lastWeekData.length > 0 ? ((lastWeekData.length - lastWeekUnread) / lastWeekData.length) * 100 : 0

    const trend = readRate > lastWeekReadRate ? "up" : "down"

    setMetrics({
      totalReports,
      unreadReports,
      readRate,
      topUnreadSections,
      recentChanges,
      trend,
    })
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Report Summary</h1>
          <p className="text-muted-foreground">One-minute overview of key signals from team reports</p>
        </div>
        <UploadReportForm onUploadReport={handleUploadReport} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalReports}</div>
            <p className="text-xs text-muted-foreground">Reports in tracking system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Reports</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.unreadReports}</div>
            <p className="text-xs text-muted-foreground">Require leadership attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
            {metrics.trend === "up" ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.readRate.toFixed(1)}%</div>
            <Progress value={metrics.readRate} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Priority Section</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{metrics.topUnreadSections[0]?.section || "None"}</div>
            <p className="text-xs text-muted-foreground">{metrics.topUnreadSections[0]?.count || 0} unread reports</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="unread">Unread Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="insights" className="space-y-4">
          <ReportInsights metrics={metrics} />
        </TabsContent>
        <TabsContent value="metrics" className="space-y-4">
          <ReportMetrics metrics={metrics} />
        </TabsContent>
        <TabsContent value="unread" className="space-y-4">
          <UnreadReports reportData={reportData.filter((r) => r.Leadership_Viewed === "No")} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[50px] mb-2" />
                <Skeleton className="h-4 w-[120px]" />
              </CardContent>
            </Card>
          ))}
      </div>

      <div>
        <Skeleton className="h-10 w-[300px] mb-4" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  )
}
