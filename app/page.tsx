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

const MARQUEE_SECONDARY = [
  "1:1 Coaching",
  "Virtual Sessions",
  "Free Consultation",
  "Biblical Guidance",
  "Clarity · Courage · Confidence",
];

function Divider() {
  return <div className="h-3 bg-cream-300" />;
}

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Nav />
      <Hero />
      <Divider />
      <ForYouIf />
      <Divider />
      <WhatWeFocusOn />
      <Divider />
      <RootedAndRising />
      <Divider />
      <MeetKristen />
      <Divider />
      <Testimonials />
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
