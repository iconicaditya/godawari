"use client";
import { useState } from 'react';
import { Link } from '@/client/next-router';
import { useQuery } from '@tanstack/react-query';
import { localQuery } from '@/client/lib/localData';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Layout } from '@/client/components/nursery/Layout';
import { BotanicalButton } from '@/client/components/nursery/Button';
import { ProductCard, type Plant } from '@/client/components/nursery/ProductCard';

const STEPS = [
  {
    key: 'light' as const,
    question: 'How much light reaches your space?',
    options: [
      { value: 'low', label: 'Soft, indirect — North-facing or interior corner', tag: 'low-light' },
      { value: 'bright', label: 'Bright but filtered — East or shaded south window', tag: 'bright' },
      { value: 'sun', label: 'Direct sun — South window or open balcony', tag: 'full-sun' },
    ],
  },
  {
    key: 'care' as const,
    question: 'How present can you be?',
    options: [
      { value: 'easy', label: 'Quietly — once a fortnight at most', tag: 'easy' },
      { value: 'moderate', label: 'Weekly, with intention', tag: 'moderate' },
      { value: 'expert', label: 'Daily — I am a serious gardener', tag: 'expert' },
    ],
  },
  {
    key: 'mood' as const,
    question: 'What mood do you wish to cultivate?',
    options: [
      { value: 'sculptural', label: 'Sculptural and architectural', cat: 'indoor' },
      { value: 'soft', label: 'Soft and trailing', cat: 'indoor' },
      { value: 'flowering', label: 'Flowering and fragrant', cat: 'flowering' },
      { value: 'desert', label: 'Quiet, dry, geometric', cat: 'succulent' },
      { value: 'collector', label: 'Heritage, collected, considered', cat: 'bonsai' },
    ],
  },
];

export default function PlantFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const done = step >= STEPS.length;
  const moodOpt = STEPS[2].options.find((o) => o.value === answers.mood) as any;
  const category = moodOpt?.cat ?? '';

  const { data: results = [] } = useQuery({
    ...localQuery<Plant[]>('nursery.listPlants', { category, limit: 6 }),
    enabled: done,
  });

  function pick(value: string) {
    const k = STEPS[step].key;
    setAnswers((a) => ({ ...a, [k]: value }));
    setStep((s) => s + 1);
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <Layout>
      <section className="bg-forest-deep text-cream min-h-[80vh] flex items-center py-20">
        <div className="max-w-3xl mx-auto px-6 w-full">
          {!done ? (
            <>
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5 animate-fade-down">
                Question {step + 1} of {STEPS.length}
              </p>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-12 animate-fade-up">
                {STEPS[step].question}
              </h1>
              <div className="space-y-4">
                {STEPS[step].options.map((o, i) => (
                  <button
                    key={o.value}
                    onClick={() => pick(o.value)}
                    className="w-full text-left border border-cream/30 hover:border-gold hover:bg-cream/5 px-8 py-6 transition-all duration-500 group animate-fade-up flex items-center justify-between"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="font-display text-2xl">{o.label}</span>
                    <ArrowRight className="w-5 h-5 text-cream/50 group-hover:text-gold group-hover:translate-x-1 transition-all duration-500" />
                  </button>
                ))}
              </div>
              {/* Progress */}
              <div className="mt-12 flex gap-2">
                {STEPS.map((_, i) => (
                  <div key={i} className={`h-px flex-1 transition-colors duration-500 ${i <= step ? 'bg-gold' : 'bg-cream/20'}`} />
                ))}
              </div>
            </>
          ) : (
            <div className="animate-fade-up text-center">
              <p className="text-[11px] tracking-[0.4em] uppercase text-gold-light mb-5">Your Plants</p>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mb-6">A handful, chosen for you.</h1>
              <p className="text-cream/70 mb-10 max-w-xl mx-auto">
                Based on your answers, here is a selection from our greenhouses you may quietly love.
              </p>
              <button onClick={reset} className="inline-flex items-center gap-2 link-underline text-[11px] tracking-[0.3em] uppercase text-gold-light">
                <RefreshCw className="w-3 h-3" /> Begin Again
              </button>
            </div>
          )}
        </div>
      </section>

      {done && (
        <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
          {results.length === 0 ? (
            <p className="text-center py-20 text-forest/70">Loading recommendations…</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
              {results.map((p, i) => <ProductCard key={p._id} plant={p} index={i} />)}
            </div>
          )}
          <div className="text-center mt-16">
            <Link to="/shop"><BotanicalButton size="lg">Browse All Plants<ArrowRight className="w-4 h-4" /></BotanicalButton></Link>
          </div>
        </section>
      )}
    </Layout>
  );
}


