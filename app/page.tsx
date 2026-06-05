import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { ForYouIf } from "@/components/ForYouIf";
import { WhatWeFocusOn } from "@/components/WhatWeFocusOn";
import { RootedAndRising } from "@/components/RootedAndRising";
import { MeetKristen } from "@/components/MeetKristen";
import { Testimonials } from "@/components/Testimonials";
import { Marquee } from "@/components/Marquee";
import { Method } from "@/components/Method";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/db";

const MARQUEE_SECONDARY = [
  "Walk in Purpose",
  "Live in Faith",
  "Rooted & Rising",
  "Clarity · Courage · Confidence",
  "Christ-Centered Coaching",
  "Renew Your Strength",
];

function Divider() {
  return <div className="h-6" />;
}

async function getSiteContent(): Promise<Record<string, string>> {
  try {
    const items = await prisma.siteContent.findMany();
    return Object.fromEntries(items.map((i: { key: string; value: string }) => [i.key, i.value]));
  } catch {
    return {};
  }
}

export default async function Home() {
  const content = await getSiteContent();

  return (
    <main>
      <ScrollProgress />
      <Nav />
      <Hero heroImage={content["hero.image"]} heroSubheadline={content["hero.subheadline"]} />
      <Divider />
      <WhatWeFocusOn focusImage={content["focus.image"]} />
      <Divider />
      <MeetKristen
        portraitImage={content["meet.image"]}
        bio1={content["meet.bio1"]}
        bio2={content["meet.bio2"]}
        bio3={content["meet.bio3"]}
        bio4={content["meet.bio4"]}
      />
      <Divider />
      <Testimonials />
      <Divider />
      <ForYouIf />
      <Divider />
      <RootedAndRising />
      <Divider />
      <Marquee items={MARQUEE_SECONDARY} tone="light" direction="right" />
      <Divider />
      <Method />
      <Divider />
      <Contact />
      <Footer />
    </main>
  );
}
