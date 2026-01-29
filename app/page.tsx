import { Hero } from "@/components/features/hero";
import { FeaturesSection } from "@/components/features/features-section";

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <FeaturesSection />
    </div>
  );
}
