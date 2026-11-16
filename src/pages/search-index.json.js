import site from '../data/site.json';

/** Build-time search index for the quick-search dialog: projects and labs only, same origin. */
export function GET() {
  const projects = site.projects.map((project) => ({
    kind: 'project',
    title: project.title,
    description: project.description,
    tags: project.tags ?? [],
    status: project.status ?? '',
    url: project.url,
  }));
  const labs = site.labs.map((lab) => ({
    kind: 'lab',
    title: `${lab.code} ${lab.name}`,
    description: lab.description ?? '',
    tags: (lab.companions ?? []).map((companion) => companion.name),
    status: lab.status ?? (lab.path ? 'live' : 'planned'),
    url: lab.path ?? '/labs/',
  }));
  return new Response(JSON.stringify([...projects, ...labs]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
