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
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[100vh] overflow-hidden bg-black">
      {/* Video Background */}
      {banner?.video_url ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={banner.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        // Fallback to image if no video
        banner?.image_url && (
          <div className="absolute inset-0">
            <img
              src={banner.image_url}
              alt="Hero"
              className="w-full h-full object-cover"
            />
          </div>
        )
      )}
      
      {/* Optional overlay for better video visibility */}
      <div className="absolute inset-0 bg-black/20" />
    </section>
  )
}
