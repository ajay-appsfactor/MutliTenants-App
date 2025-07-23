"use client"

import { useEffect, useState } from "react"
import QuotationForm from "@/components/QuotationForm"

export default function QuotationPage() {
  const [data, setData] = useState([])

  async function fetchQuotations() {
    const res = await fetch("/api/quotations")
    const json = await res.json()
    setData(json)
  }

  useEffect(() => {
    fetchQuotations()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Quotations</h1>
      <QuotationForm onCreated={fetchQuotations} />

      <div className="border rounded p-4">
        {data.length === 0 ? (
          <p>No quotations yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.map((q) => (
              <li key={q.id} className="border-b pb-2">
                <div className="font-bold">{q.title}</div>
                <div>₹{q.amount}</div>
                <div className="text-sm text-muted-foreground">{q.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
