'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface ImageZoomProps {
  imageUrl: string
  position: { x: number; y: number }
}

export function ImageZoom({ imageUrl, position }: ImageZoomProps) {
  const [zoomLevel, setZoomLevel] = useState(2)

  return (
    <div
      className="absolute inset-0 pointer-events-none z-10"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${zoomLevel * 100}%`,
        backgroundPosition: `${position.x}% ${position.y}%`,
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

