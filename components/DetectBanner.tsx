"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function DetectBanner() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /**
   * Background animation
   */
  const backgroundScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.12, 1]
  );

  const backgroundOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.92, 1],
    [0, 1, 1, 0.9]
  );

  /**
   * Title animation
   */
  const titleY = useTransform(
    scrollYProgress,
    [0, 1],
    [120, -120]
  );

  const titleOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.85, 1],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={sectionRef}
      className="
        relative
        h-[250dvh]
        w-screen
        ml-[calc(50%-50vw)]
        mr-[calc(50%-50vw)]
      "
    >
      {/* Sticky Hero */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Background */}
        <motion.div
          style={{
            scale: backgroundScale,
            opacity: backgroundOpacity,
          }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            className="absolute inset-0 bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url(/images/profanity_detected_in_comment.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Right Side Heading */}
        <motion.div
          style={{
            y: titleY,
            opacity: titleOpacity,
          }}
          className="
            absolute
            inset-0
            z-20
            flex
            justify-end
            py-[max(1.5rem,4vh)]
            sm:py-[max(2rem,5vh)]
            lg:py-[max(2.5rem,6vh)]
            pr-4
            sm:pr-8
            md:pr-12
            lg:pr-16
            xl:pr-20
            pl-4
            will-change-transform
          "
        >
          <h2
            className="
              h-full
              w-full
              max-w-[min(94vw,12ch)]
              flex
              flex-col
              justify-between
              items-end
              text-right
              font-black
              tracking-tight
              leading-[0.88]

              text-[clamp(2.5rem,11vw+2vh,4.25rem)]
              sm:text-[clamp(3.75rem,13vw+1.5vh,7rem)]
              md:text-[clamp(5rem,12vw+3vh,10rem)]
              lg:text-[clamp(6.5rem,11vw+4vh,14rem)]
              xl:text-[clamp(8rem,12vw+3vh,18rem)]
            "
            style={{
              fontFamily: "var(--font-display)",
              color: "rgba(12,12,12,0.92)",
              WebkitTextStroke: "0.015em rgba(20,20,20,.12)",
              textShadow:
                "0 1px 0 rgba(255,255,255,.55), 0 4px 20px rgba(255,255,255,.35)",
              letterSpacing: "-0.03em",
            }}
          >
            <span>Catch</span>
            <span>Toxic</span>
            <span>Comments</span>
          </h2>
        </motion.div>

        {/* Optional vignette for premium look */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 45%, rgba(0,0,0,.12) 100%)",
          }}
        />
      </div>
    </section>
  );
}