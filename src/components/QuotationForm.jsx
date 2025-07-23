"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function QuotationForm({ onCreated }) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    const res = await fetch("/api/quotations", {
      method: "POST",
      body: JSON.stringify({ title, amount }),
    })

    const data = await res.json()
    onCreated?.(data)
    setTitle("")
    setAmount("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Quotation Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button type="submit">Create Quotation</Button>
    </form>
  )
}
