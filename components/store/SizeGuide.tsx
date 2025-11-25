'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'

interface SizeGuideProps {
  open: boolean
  onClose: () => void
}

export function SizeGuide({ open, onClose }: SizeGuideProps) {
  const sizes = [
    { size: 'Small', length: '25cm', width: '20cm', height: '15cm' },
    { size: 'Medium', length: '30cm', width: '25cm', height: '20cm' },
    { size: 'Large', length: '35cm', width: '30cm', height: '25cm' },
    { size: 'Extra Large', length: '40cm', width: '35cm', height: '30cm' },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Please refer to the measurements below to find your perfect fit.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Size</th>
                  <th className="text-left p-3 font-semibold">Length</th>
                  <th className="text-left p-3 font-semibold">Width</th>
                  <th className="text-left p-3 font-semibold">Height</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((item) => (
                  <tr key={item.size} className="border-b">
                    <td className="p-3 font-medium">{item.size}</td>
                    <td className="p-3 text-muted-foreground">{item.length}</td>
                    <td className="p-3 text-muted-foreground">{item.width}</td>
                    <td className="p-3 text-muted-foreground">{item.height}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">How to Measure</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Length: Measure from top to bottom</li>
                <li>• Width: Measure from side to side</li>
                <li>• Height: Measure the depth of the bag</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

