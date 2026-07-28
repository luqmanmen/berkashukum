"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./ArticleCarousel.module.css";
import type { Article } from "@/generated/prisma";

// Fallback dummy data if no articles are available or to match user's demo
const fallbackData = [
  {
    id: "1",
    title: "Scotland",
    excerpt: "Experience the mystical Highlands under twilight skies and misty lochs.",
    coverImage: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1074&auto=format&fit=crop",
    slug: "scotland"
  },
  {
    id: "2",
    title: "Norway",
    excerpt: "Chase the Northern Lights under star-lit skies along scenic fjord roads.",
    coverImage: "https://images.unsplash.com/photo-1439792675105-701e6a4ab6f0?q=80&w=1173&auto=format&fit=crop",
    slug: "norway"
  },
  {
    id: "3",
    title: "New Zealand",
    excerpt: "Wander dramatic, mist-laden mountain paths that feel straight out of a dream.",
    coverImage: "https://images.unsplash.com/photo-1483982258113-b72862e6cff6?q=80&w=1170&auto=format&fit=crop",
    slug: "new-zealand"
  },
  {
    id: "4",
    title: "Japan",
    excerpt: "Discover serene mountain temples shrouded in dusk and ancient forest trails.",
    coverImage: "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop",
    slug: "japan"
  }
];

interface ArticleCarouselProps {
  articles?: (Article & { excerpt?: string })[];
}

export default function ArticleCarousel({ articles }: ArticleCarouselProps) {
  // Map provided articles or use fallback
  const initialItems = articles && articles.length > 0 
    ? articles.map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt || article.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...',
        coverImage: article.coverImage || fallbackData[0].coverImage,
        slug: article.slug
      }))
    : fallbackData;

  const [items, setItems] = useState(initialItems);

  const handleNext = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const firstItem = newItems.shift();
      if (firstItem) newItems.push(firstItem);
      return newItems;
    });
  };

  const handlePrev = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      const lastItem = newItems.pop();
      if (lastItem) newItems.unshift(lastItem);
      return newItems;
    });
  };

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.slide}>
        {items.map((item) => (
          <div
            key={item.id}
            className={styles.item}
            style={{
              backgroundImage: `url('${item.coverImage}')`,
            }}
          >
            <div className={styles.content}>
              <div className={styles.name}>{item.title}</div>
              <div className={styles.des}>{item.excerpt}</div>
              <Link href={articles && articles.length > 0 ? `/blog/${item.slug}` : "#"} className={styles.seeMore}>
                <button>See More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.buttonContainer}>
        <button className={styles.navButton} onClick={handlePrev} aria-label="Previous">
          ◁
        </button>
        <button className={styles.navButton} onClick={handleNext} aria-label="Next">
          ▷
        </button>
      </div>
    </div>
  );
}
