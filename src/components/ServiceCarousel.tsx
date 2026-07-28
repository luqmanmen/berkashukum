"use client";

import React, { useState, useEffect } from "react";
import "./ServiceCarousel.css";
import Link from "next/link";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  linkUrl: string | null;
}

interface ServiceCarouselProps {
  initialItems: ServiceItem[];
}

export default function ServiceCarousel({ initialItems }: ServiceCarouselProps) {
  // Ensure we have at least 6 items so the 3D carousel effect always works 
  // (it needs at least 2 for background crossfade + 3 or 4 for thumbnails).
  let preparedItems = initialItems || [];
  if (preparedItems.length > 0 && preparedItems.length < 6) {
    const clones = [];
    let i = 0;
    while (clones.length + preparedItems.length < 6) {
      const source = preparedItems[i % preparedItems.length];
      clones.push({
        ...source,
        id: `${source.id}-clone-${i}` // Ensure unique keys for clones
      });
      i++;
    }
    preparedItems = [...preparedItems, ...clones];
  }

  const slideRef = React.useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (slideRef.current) {
      const slideItems = slideRef.current.querySelectorAll(".item");
      if (slideItems.length > 0) {
        slideRef.current.appendChild(slideItems[0]);
      }
    }
  };

  const handlePrev = () => {
    if (slideRef.current) {
      const slideItems = slideRef.current.querySelectorAll(".item");
      if (slideItems.length > 0) {
        slideRef.current.prepend(slideItems[slideItems.length - 1]);
      }
    }
  };

  return (
    <div id="service-carousel" className="relative w-full h-full min-h-[500px]">
      <div className="container">
        {preparedItems.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl text-gray-500">
            <span className="text-4xl mb-4">🗂️</span>
            <p className="font-semibold">Belum Ada Layanan</p>
          </div>
        ) : (
          <>
            <div className="slide" ref={slideRef}>
              {preparedItems.map((item) => (
                <div
                  key={item.id}
                  className="item"
                  style={{
                    backgroundImage: `url('${item.imageUrl || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1200&auto=format&fit=crop"}')`,
                  }}
                >
                  <div className="content">
                    <div className="name">{item.name}</div>
                    <div className="des">{item.description}</div>
                    {item.linkUrl && (
                      <Link className="seeMore" href={item.linkUrl} target={item.linkUrl.startsWith("http") ? "_blank" : "_self"}>
                        <button>Lihat Detail</button>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {preparedItems.length > 1 && (
              <div className="button">
                <button className="prev" onClick={handlePrev} aria-label="Previous">
                  &lt;
                </button>
                <button className="next" onClick={handleNext} aria-label="Next">
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
