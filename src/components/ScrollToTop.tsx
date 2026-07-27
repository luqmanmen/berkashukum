"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Ensures that whenever the route changes, the page instantly snaps to the top.
    // This fixes issues where 'scroll-behavior: smooth' in CSS conflicts with Next.js navigation.
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
