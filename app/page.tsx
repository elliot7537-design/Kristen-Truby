import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FeaturedIn } from "@/components/FeaturedIn";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Stats } from "@/components/Stats";
import { Method } from "@/components/Method";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <FeaturedIn />
      <About />
      <Services />
      <Stats />
      <Method />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
