import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { ForYouIf } from "@/components/ForYouIf";
import { WhatWeFocusOn } from "@/components/WhatWeFocusOn";
import { RootedAndRising } from "@/components/RootedAndRising";
import { MeetKristen } from "@/components/MeetKristen";
import { Stats } from "@/components/Stats";
import { ScriptureBand } from "@/components/ScriptureBand";
import { Method } from "@/components/Method";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

const MARQUEE_PRIMARY = [
  "Walk in Purpose",
  "Live in Faith",
  "Rooted & Rising",
  "Christ-Centered Coaching",
  "Renew Your Strength",
];

const MARQUEE_SECONDARY = [
  "1:1 Coaching",
  "Virtual Sessions",
  "Free Consultation",
  "Biblical Guidance",
  "Clarity · Courage · Confidence",
];

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Marquee items={MARQUEE_PRIMARY} tone="dark" />
      <ForYouIf />
      <WhatWeFocusOn />
      <RootedAndRising />
      <MeetKristen />
      <Testimonials />
      <Marquee items={MARQUEE_SECONDARY} tone="light" direction="right" />
      <Stats />
      <ScriptureBand />
      <Method />
      <Contact />
      <Footer />
    </main>
  );
}
