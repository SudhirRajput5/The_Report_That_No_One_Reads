// Function to fetch and parse the CSV data
export async function fetchReportData() {
  try {
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/week2%20-%20Problem_1_-_Unread_Report_Tracker__60_Rows_-3BJtQJ1suo6T36Y0am6IE0AveeiXsU.csv",
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`)
    }

    const csvText = await response.text()
    return parseCSV(csvText)
  } catch (error) {
    console.error("Error fetching report data:", error)
    throw error
  }
}

// Function to parse CSV text into an array of objects
function parseCSV(csvText: string) {
  const lines = csvText.split("\n")
  const headers = lines[0].split(",").map((header) => header.trim())

  const results = []

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    const values = lines[i].split(",").map((value) => value.trim())
    const row = {}

    headers.forEach((header, index) => {
      row[header] = values[index]
    })

    results.push(row)
  }

  return results
}
