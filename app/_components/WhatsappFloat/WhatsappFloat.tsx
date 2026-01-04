"use client";

import { useEffect, useRef } from "react";
import "./WhatsappFloat.css";

export default function WhatsappFloat() {
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;

    let frame: number;

    const animate = () => {
      const now = Date.now();
      const rotate = Math.sin(now / 200) * 6; // gira de -6° a +6°
      el.style.transform = `rotate(${rotate}deg)`;
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={floatRef} className="whatsapp-float">
      <a
        href="https://wa.me/5521976586293"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-icon"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <img src="/whats2.svg" alt="Fale no WhatsApp" />
      </a>
    </div>
  );
}
