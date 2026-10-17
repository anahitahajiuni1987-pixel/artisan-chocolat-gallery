import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { BrandStory, CraftedByHand, ExperienceSequence, FinalCTA, GiftsForMoments, Reveal, SignatureCollection } from "@/components/home/Sections";
import { BoxBuilder } from "@/components/store/BoxBuilder";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "آناهیتا | تکه‌ای کوچک از هنر — شکلات دست‌ساز" },
      { name: "description", content: "شکلات‌های دست‌ساز، جعبه‌های هدیه و جعبهٔ دلخواه با پیام شخصی. ارسال به سراسر ایران." },
      { property: "og:title", content: "آناهیتا | تکه‌ای کوچک از هنر" },
      { property: "og:description", content: "شکلات‌های دست‌ساز و جعبه‌های هدیهٔ آناهیتا" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <SignatureCollection />
      <ExperienceSequence />
      <CraftedByHand />
      <GiftsForMoments />
      <section className="container-lux py-28 md:py-36">
        <Reveal className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4">۰۵ — جعبهٔ خودتان را بسازید</p>
          <h2 className="text-4xl md:text-5xl">هدیه‌ای که فقط شما می‌توانستید بچینید</h2>
        </Reveal>
        <BoxBuilder />
      </section>
      <BrandStory />
      <FinalCTA />
    </>
  );
}
