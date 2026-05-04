import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { ForYouIf } from "@/components/ForYouIf";
import { WhatWeFocusOn } from "@/components/WhatWeFocusOn";
import { RootedAndRising } from "@/components/RootedAndRising";
import { MeetKristen } from "@/components/MeetKristen";
import { Testimonials } from "@/components/Testimonials";
import { Marquee } from "@/components/Marquee";
import { ScriptureBand } from "@/components/ScriptureBand";
import { Method } from "@/components/Method";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

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
      <ForYouIf />
      <WhatWeFocusOn />
      <RootedAndRising />
      <MeetKristen />
      <Testimonials />
      <Marquee items={MARQUEE_SECONDARY} tone="light" direction="right" />
      <ScriptureBand />
      <Method />
      <Contact />
      <Footer />
    </main>
  );
}
