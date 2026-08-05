import { z } from 'zod';
import { projectSchema, type Project } from './schema';

/**
 * Project records.
 *
 * The reference table behind the reporting: what each project is, where it is,
 * what it consists of and where it has got to. Records are shared by both
 * locales, so their prose is written twice.
 *
 * Nothing in this file is invented. If a figure is not known, the field is
 * absent rather than filled — the schema makes every quantitative field
 * optional for exactly that reason.
 */

// The *input* type: fields with schema defaults (alternateNames, technology)
// stay optional here and are filled in by `parse` below.
const raw: z.input<typeof projectSchema>[] = [
  // Syrian project records are added here as coverage establishes them.
];

export const PROJECTS: Project[] = raw.map((p) => projectSchema.parse(p));

export const PROJECT_MAP = new Map(PROJECTS.map((p) => [p.slug, p]));

export function getProject(slug: string): Project | undefined {
  return PROJECT_MAP.get(slug);
}
