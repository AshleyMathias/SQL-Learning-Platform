import { motion, AnimatePresence } from 'framer-motion';
import { explainQuery } from '@sql-brush-up/shared';
import { ArrowDown } from 'lucide-react';

interface QueryVisualizerProps {
  sql: string;
  isVisible: boolean;
}

export function QueryVisualizer({ sql, isVisible }: QueryVisualizerProps) {
  const explanation = explainQuery(sql);

  if (!isVisible || explanation.executionOrder.length === 0) return null;

  return (
    <div className="p-4 space-y-3">
      <p className="text-sm text-muted-foreground">{explanation.summary}</p>
      <div className="flex flex-col items-center gap-1">
        <AnimatePresence>
          {explanation.executionOrder.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
              className="w-full"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="font-mono text-sm font-medium text-primary">{step}</p>
                  <p className="text-xs text-muted-foreground">
                    {explanation.clauses.find((c) => c.clause === step)?.description}
                  </p>
                </div>
              </div>
              {i < explanation.executionOrder.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
