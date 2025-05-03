import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export function UnreadReports({ reportData }) {
  // Sort by date, newest first
  const sortedReports = [...reportData].sort(
    (a, b) => new Date(b.Report_Date).getTime() - new Date(a.Report_Date).getTime(),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unread Reports</CardTitle>
        <CardDescription>Reports that require leadership attention</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Changes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReports.map((report, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {formatDistanceToNow(new Date(report.Report_Date), { addSuffix: true })}
                </TableCell>
                <TableCell>{report.Section}</TableCell>
                <TableCell>{report.Submitted_By}</TableCell>
                <TableCell>
                  <Badge variant="destructive">Unread</Badge>
                </TableCell>
                <TableCell>
                  {report.Changed_Since_Last_Week === "No change" ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">No change</Badge>
                  ) : report.Changed_Since_Last_Week === "Major revision" ? (
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                      {report.Changed_Since_Last_Week}
                    </Badge>
                  ) : report.Changed_Since_Last_Week === "Updated" ? (
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">
                      {report.Changed_Since_Last_Week}
                    </Badge>
                  ) : report.Changed_Since_Last_Week === "Reworded" ? (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                      {report.Changed_Since_Last_Week}
                    </Badge>
                  ) : report.Changed_Since_Last_Week === "New report" ? (
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">
                      {report.Changed_Since_Last_Week}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200">
                      {report.Changed_Since_Last_Week}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
