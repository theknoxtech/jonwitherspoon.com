import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** BLOG_DIR lets the tests build from a fixture folder; the real site always reads src/content/blog. */
const blogDirectory = process.env.BLOG_DIR ?? 'src/content/blog';

const blog = defineCollection({
    loader: glob({ pattern: '**/*.md', base: blogDirectory }),
    schema: ({ image }) =>
        z
            .object({
                title: z.string(),
                date: z.coerce.date(),
                description: z.string(),
                cover: image().optional(),
                coverAlt: z.string().trim().min(1).optional(),
                tags: z.array(z.string()).default([]),
                draft: z.boolean().default(false),
            })
            .refine((article) => !article.cover || article.coverAlt, {
                message: 'coverAlt is required when cover is set (describe the banner picture for screen readers)',
                path: ['coverAlt'],
            }),
});

export const collections = { blog };
