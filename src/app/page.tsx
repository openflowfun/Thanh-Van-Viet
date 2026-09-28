import { Hero } from "@/components/home/Hero";
import { StoryRibbon } from "@/components/home/StoryRibbon";
import { EditorialBand } from "@/components/home/EditorialBand";
import { CollectionTiles, FamilyFeature, LookbookStrip, SoftCTA, ThisSeason, Values } from "@/components/home/Sections";
import { Marquee } from "@/components/ui/Marquee";
import { SITE } from "@/lib/format";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: SITE.wordmark,
  slogan: SITE.tagline,
  description: "Authentic Vietnamese fashion and lifestyle pieces — áo dài, family sets, silk accessories — selected in Melbourne for Australia.",
  email: SITE.email,
  url: SITE.url,
  address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressRegion: "VIC", addressCountry: "AU" },
  areaServed: ["AU"],
  currenciesAccepted: "AUD",
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Marquee />
      <CollectionTiles />
      <StoryRibbon />
      <ThisSeason />
      <EditorialBand />
      <FamilyFeature />
      <Values />
      <LookbookStrip />
      <SoftCTA />
    </>
  );
}
