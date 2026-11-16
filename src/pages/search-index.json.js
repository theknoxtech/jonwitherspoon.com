import site from '../data/site.json';

/** Build-time search index for the quick-search dialog: projects and labs only, same origin. */
export function GET() {
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
  return new Response(JSON.stringify([...projects, ...labs]), {
    headers: { 'Content-Type': 'application/json' },
  });
}
