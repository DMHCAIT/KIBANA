'use client'

interface HeroSectionProps {
  banner?: {
    title?: string
    subtitle?: string
    image_url?: string
    video_url?: string
    link_url?: string
  }
}

export function HeroSection({ banner }: HeroSectionProps) {
  // Use banner video_url if provided, otherwise use default video
  const videoUrl = banner?.video_url || '/hero-video.mp4'
  
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[100vh] overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Optional overlay for better video visibility */}
      <div className="absolute inset-0 bg-black/10" />
    </section>
  )
}
