import { BirthdayCountdown } from '../components/BirthdayCountdown';
import { HeroPhoneMockup } from '../components/HeroPhoneMockup';
import { RelationshipCounter } from '../components/RelationshipCounter';

export function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="flex justify-center pt-4">
        <HeroPhoneMockup />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <RelationshipCounter />
        <BirthdayCountdown />
      </div>
    </div>
  );
}
