import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, TrendingDown, TrendingUp } from "lucide-react"

export function ReportInsights({ metrics }) {
  // Generate insights based on the metrics
  const insights = [
    {
      title: "Executive Summary",
      description: `${metrics.unreadReports} of ${metrics.totalReports} reports (${(100 - metrics.readRate).toFixed(1)}%) require leadership attention. The read rate is ${metrics.trend === "up" ? "improving" : "declining"}.`,
      icon: metrics.trend === "up" ? TrendingUp : TrendingDown,
      iconColor: metrics.trend === "up" ? "text-green-500" : "text-red-500",
    },
    {
      title: "Priority Areas",
      description: `The "${metrics.topUnreadSections[0]?.section}" section has the highest number of unread reports (${metrics.topUnreadSections[0]?.count}), followed by "${metrics.topUnreadSections[1]?.section}" (${metrics.topUnreadSections[1]?.count}).`,
      icon: AlertCircle,
      iconColor: "text-amber-500",
    },
    {
      title: "Recent Changes",
      description:
        metrics.recentChanges.length > 0
          ? `${metrics.recentChanges.length} reports have been updated recently. Most common change type: "${metrics.recentChanges[0]?.Changed_Since_Last_Week}".`
          : "No recent changes detected in reports.",
      icon: Clock,
      iconColor: "text-blue-500",
    },
    {
      title: "Recommended Actions",
      description: `1. Review the ${metrics.topUnreadSections[0]?.count} unread reports in the "${metrics.topUnreadSections[0]?.section}" section.\n2. Check reports with recent changes.\n3. Improve the overall read rate by scheduling dedicated review time.`,
      icon: CheckCircle2,
      iconColor: "text-green-500",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {insights.map((insight, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">{insight.title}</CardTitle>
            <insight.icon className={`h-5 w-5 ${insight.iconColor}`} />
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{insight.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
