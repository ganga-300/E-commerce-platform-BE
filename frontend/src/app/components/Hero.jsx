"use client"
import React from "react"

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/stvideo.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 bg-black/20">
        <h1
          className="text-white text-5xl md:text-7xl font-bold drop-shadow-lg"
          style={{ fontFamily: "TTRamillas" }}
        >
          Your All-In-One <br /> Accessories Destination
        </h1>
        <button className="mt-8 px-8 py-3 bg-white/20 border border-white text-white text-lg font-semibold rounded-full backdrop-blur-md hover:bg-white/30 transition">
          Shop Now
        </button>
      </div>
    </section>
  )
}
