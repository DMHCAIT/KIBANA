'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface SalesChartProps {
  revenueData: Array<{ total_amount: number; created_at: string }>
}

export function SalesChart({ revenueData }: SalesChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || revenueData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Group by date
    const dailyRevenue = revenueData.reduce((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString()
      acc[date] = (acc[date] || 0) + order.total_amount
      return acc
    }, {} as Record<string, number>)

    const dates = Object.keys(dailyRevenue).sort()
    const amounts = dates.map(date => dailyRevenue[date])
    const maxAmount = Math.max(...amounts, 1)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw chart
    const padding = 40
    const chartWidth = canvas.width - padding * 2
    const chartHeight = canvas.height - padding * 2

    // Draw grid
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(canvas.width - padding, y)
      ctx.stroke()
    }

    // Draw line
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    dates.forEach((date, index) => {
      const x = padding + (chartWidth / (dates.length - 1 || 1)) * index
      const y = canvas.height - padding - (amounts[index] / maxAmount) * chartHeight
      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()

    // Draw points
    ctx.fillStyle = '#3b82f6'
    dates.forEach((date, index) => {
      const x = padding + (chartWidth / (dates.length - 1 || 1)) * index
      const y = canvas.height - padding - (amounts[index] / maxAmount) * chartHeight
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [revenueData])

  const totalRevenue = revenueData.reduce((sum, order) => sum + order.total_amount, 0)
  const avgDailyRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sales Overview</CardTitle>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>+12.5%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            Average: ₹{avgDailyRevenue.toLocaleString()} per day
          </p>
        </div>
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-48 border rounded"
        />
      </CardContent>
    </Card>
  )
}

