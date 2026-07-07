import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, Rocket, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePreferencesStore } from '@/stores/preferences-store';
import type { SkillLevel } from '@sql-brush-up/shared';

const levels: { level: SkillLevel; icon: typeof Sparkles; title: string; description: string }[] = [
  {
    level: 'beginner',
    icon: Sparkles,
    title: 'Beginner',
    description: 'I know nothing about SQL. Start from the basics — what is data, tables, and your first query.',
  },
  {
    level: 'intermediate',
    icon: Rocket,
    title: 'Intermediate',
    description: 'I know basics. Skip fundamentals and focus on filtering, joins, and aggregates.',
  },
  {
    level: 'advanced',
    icon: Crown,
    title: 'Advanced',
    description: 'I am comfortable with SQL. Take me straight to the SQL Workspace.',
  },
];

export function WelcomePage() {
  const navigate = useNavigate();
  const { setSkillLevel, completeOnboarding } = usePreferencesStore();
  const [selected, setSelected] = useState<SkillLevel | null>(null);

  function handleContinue() {
    if (!selected) return;
    setSkillLevel(selected);
    completeOnboarding();
    if (selected === 'advanced') {
      navigate('/playground');
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full space-y-8 text-center"
      >
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="gradient-text">SQL Brush Up</span>
          </h1>
          <p className="text-xl text-muted-foreground">Learn SQL by Doing.</p>
          <p className="text-sm text-muted-foreground max-w-lg mx-auto">
            No documentation to read. No AI shortcuts. Just you, real databases, and hands-on practice
            that builds genuine understanding.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium">What is your skill level?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {levels.map(({ level, icon: Icon, title, description }) => (
              <Card
                key={level}
                className={`cursor-pointer transition-all hover:border-primary/50 ${
                  selected === level ? 'border-primary ring-2 ring-primary/30' : ''
                }`}
                onClick={() => setSelected(level)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(level)}
                aria-pressed={selected === level}
              >
                <CardHeader className="pb-2">
                  <Icon className={`h-6 w-6 mb-2 ${selected === level ? 'text-primary' : 'text-muted-foreground'}`} />
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-left text-xs">{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button size="lg" disabled={!selected} onClick={handleContinue} className="min-w-[200px]">
          Continue
        </Button>
      </motion.div>
    </div>
  );
}
