import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    relatedServices: z.array(z.string()),
    seoTitle: z.string().optional(),
    lang: z.enum(['es', 'en']),
    translationSlug: z.string(),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).default([]),
    lang: z.enum(['es', 'en']),
    translationSlug: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { services, journal };
