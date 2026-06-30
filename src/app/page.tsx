import React from 'react';
import { DashboardContent } from '../components/layout/DashboardContent';
import { getProjects, getBlogs, getLinks, getPlaygroundApps } from './actions';

// Force dynamic server rendering so database checks are done on request rather than static build compile time
export const dynamic = 'force-dynamic';

export default async function Home() {
  // Load latest data directly from database on server side
  const projects = await getProjects();
  const blogs = await getBlogs();
  const links = await getLinks();
  const apps = await getPlaygroundApps();

  return (
    <DashboardContent
      initialProjects={projects}
      initialBlogs={blogs}
      initialLinks={links}
      initialApps={apps}
    />
  );
}
