import { getCollection } from 'astro:content';
import site from '../data/site.json';
import { publishedArticles } from '../lib/articles.js';

/** Build-time search index for the quick-search dialog: projects, labs and published articles, same origin. */
export async function GET() {
  const projects = site.projects.map((project) => ({
    kind: 'project',
    title: project.title,
    description: project.description,
    tags: project.tags ?? [],
    status: project.status ?? '',
    url: (project.links ?? [])[0]?.url ?? '/projects/',
  }));
  const labs = site.labs.map((lab) => {
    const links = (lab.links ?? []).filter((link) => link.path);
    return {
      kind: 'lab',
      title: `${lab.code} ${lab.name}`,
      description: [lab.description, lab.currentFor].filter(Boolean).join(' '),
      tags: links.map((link) => link.label),
      status: lab.status ?? (links.length > 0 ? 'live' : 'planned'),
      url: links[0]?.path ?? '/labs/',
    };
  });
  const articles = publishedArticles(await getCollection('blog')).map((article) => ({
    kind: 'article',
    title: article.data.title,
    description: article.data.description,
    tags: article.data.tags,
    status: '',
    url: `/articles/${article.id}/`,
  }));
  return new Response(JSON.stringify([...projects, ...labs, ...articles]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
