import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

export function ReportMetrics({ metrics }) {
  // Transform section data for chart
  const sectionData = metrics.topUnreadSections.map((item) => ({
    name: item.section,
    value: item.count,
  }))

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Unread Reports by Section</CardTitle>
          <CardDescription>Sections requiring immediate leadership attention</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[300px]">
            <ChartContainer
              config={{
                section: {
                  label: "Section",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectionData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
                  />
                  <YAxis tickLine={false} axisLine={false} tickCount={5} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-section)" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
