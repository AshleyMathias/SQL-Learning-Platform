import type { SampleDatabase } from '@sql-brush-up/shared';
import { studentManagement } from '@/sample-data/student-management';
import { library } from '@/sample-data/library';
import { hospital } from '@/sample-data/hospital';
import { movies } from '@/sample-data/movies';
import { bank } from '@/sample-data/bank';
import { university } from '@/sample-data/university';
import { hr } from '@/sample-data/hr';
import { ecommerce } from '@/sample-data/ecommerce';
import { restaurant } from '@/sample-data/restaurant';
import { orders } from '@/sample-data/orders';
import { employees } from '@/sample-data/employees';
import { inventory } from '@/sample-data/inventory';
import { northwind } from '@/sample-data/northwind';

export const SAMPLE_DATABASES: SampleDatabase[] = [
  studentManagement,
  library,
  hospital,
  movies,
  bank,
  university,
  hr,
  ecommerce,
  restaurant,
  orders,
  employees,
  inventory,
  northwind,
];

export function getSampleDatabase(id: string): SampleDatabase | undefined {
  return SAMPLE_DATABASES.find((db) => db.id === id);
}

export function getStarterSampleDatabase(skillLevel: 'beginner' | 'intermediate' | 'advanced'): SampleDatabase {
  if (skillLevel === 'advanced') {
    return northwind;
  }

  if (skillLevel === 'intermediate') {
    return ecommerce;
  }

  return studentManagement;
}
