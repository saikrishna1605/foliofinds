"use client";

import Link from "next/link";
import {useEffect, useState} from 'react';
import { Button } from "./ui/button";

declare global {
    interface Window {
        Tawk_API?: {
          toggle: () => void;
        };
    }
}

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const toggleTawk = () => {
      if (window.Tawk_API && typeof window.Tawk_API.toggle === 'function') {
        window.Tawk_API.toggle();
      } else {
        console.warn("Tawk_API not found or not ready.");
      }
  }

  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {year} FolioFinds. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={toggleTawk}>Live Support</Button>
          <Link href="#" className="text-sm hover:underline text-muted-foreground hover:text-foreground">Privacy Policy</Link>
          <Link href="#" className="text-sm hover:underline text-muted-foreground hover:text-foreground">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
