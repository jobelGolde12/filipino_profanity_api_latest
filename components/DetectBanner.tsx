export function DetectBanner() {
  return (
    <section className="relative overflow-hidden w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] h-[250vh]">
      {/* Background fills the full 250vh section — scrolls naturally */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center pointer-events-none"
        style={{
          backgroundImage: "url(/images/profanity_detected_in_comment.png)",
          backgroundSize: "100% 100%",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/[0.08] pointer-events-none" aria-hidden />

      {/* Text overlay stays sticky so it remains visible while scrolling */}
      <div className="sticky top-0 h-[100dvh] z-10 flex justify-end py-[max(1.5rem,4vh)] sm:py-[max(2rem,5vh)] lg:py-[max(2.5rem,6vh)] pr-4 sm:pr-8 md:pr-12 lg:pr-16 xl:pr-20 pl-4">
        <h2
          className="
            h-full w-full max-w-[min(94vw,12ch)]
            flex flex-col justify-between items-end
            text-right tracking-tight leading-[0.88] font-black
            text-[clamp(2.5rem,11vw+2vh,4.25rem)]
            sm:text-[clamp(3.75rem,13vw+1.5vh,7rem)]
            md:text-[clamp(5rem,12vw+3vh,10rem)]
            lg:text-[clamp(6.5rem,11vw+4vh,14rem)]
            xl:text-[clamp(8rem,12vw+3vh,18rem)]
          "
          style={{
            fontFamily: "var(--font-display)",
            color: "rgba(12, 12, 12, 0.9)",
            WebkitTextStroke: "0.015em rgba(20, 20, 20, 0.12)",
            textShadow:
              "0 1px 0 rgba(255, 255, 255, 0.55), 0 4px 20px rgba(255, 255, 255, 0.3)",
            letterSpacing: "-0.03em",
          }}
        >
          <span className="block max-w-full">Catch</span>
          <span className="block max-w-full">Toxic</span>
          <span className="block max-w-full">Comments</span>
        </h2>
      </div>
    </section>
  );
}
