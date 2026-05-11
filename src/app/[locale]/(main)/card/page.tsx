import CardHero from '@/components/card/CardHero';
import CardPartners from '@/components/card/CardPartners';

export default function CardPage() {
  return (
    <main className="bg-site-bg-alt">
      <CardHero />
      <CardPartners />
    </main>
  );
}
