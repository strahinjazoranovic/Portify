import { useEffect, useState } from 'react';

type Project = {
    id: number;
    name: string;
    status: string;
    description: string;
    deadline: string;
    progress: number;
    logo: string;
};

export function UserCardProject() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/projects');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data: Project[] = await res.json();
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="space-y-4">
            {projects.length === 0 ? (
                <h1 className="text-center text-xl">
                    No active projects found
                </h1>
            ) : (
                projects.map((project) => (
                    <div
                        key={project.id}
                        className="w-full max-w-2xl rounded-lg border border-zinc-300 bg-white shadow-md"
                    >
                        <div className="flex justify-center p-6">
                            {project.logo && (
                                <img src={project.logo} alt={project.name} />
                            )}
                        </div>
                        <div className='p-6 border-t border-zinc-200'>
                            <div className="flex items-start justify-between">
                                <h1 className="text-3xl font-bold text-zinc-900">
                                    {project.name}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Deadline: {project.deadline}
                                </p>
                            </div>

                            <div className="mt-4 h-6 w-full overflow-hidden rounded-full bg-gray-200">
                                <h1 className="ml-2">
                                    Progress: {project.progress}%
                                </h1>
                                <div
                                    className="h-full rounded-full bg-green-500 transition-all duration-300"
                                    style={{
                                        width: `${project.progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
