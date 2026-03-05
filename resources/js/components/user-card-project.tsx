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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/projects');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: Project[] = await res.json();
                setProjects(data);
                console.log('Fetched projects:', data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="mt-2 flex flex-wrap justify-center gap-6">
            {loading ? (
                // Skeleton Loader
                Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-[calc(50%-0.75rem)] max-w-2xl animate-pulse rounded-lg bg-white shadow-md"
                    >
                        <div className="flex h-53 justify-center p-6">
                            <div className="h-40 w-40 rounded-full bg-gray-300"></div>
                        </div>

                        <div className="border-t border-zinc-200 p-6">
                            <div className="flex items-start justify-between">
                                <div className="h-6 w-40 rounded-lg bg-gray-300"></div>
                                <div className="h-4 w-24 rounded-lg bg-gray-300"></div>
                            </div>

                            <div className="mt-4">
                                <div className="mb-2 h-4 w-32 rounded-lg bg-gray-300"></div>
                                <div className="mb-2 h-4 w-32 rounded-lg bg-gray-300"></div>

                                <div className="h-4 w-full rounded-full bg-gray-200">
                                    <div className="h-full w-1/2 rounded-full bg-gray-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : projects.length === 0 ? (
                <h1 className="text-center text-xl">
                    No active projects found
                </h1>
            ) : (
                projects.map((project) => (
                    <div
                        key={project.id}
                        className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white shadow-md"
                    >
                        <div className="flex h-50 justify-center p-6">
                            {project.logo && (
                                <img src={project.logo} alt={project.name} />
                            )}
                        </div>

                        <div className="border-t border-zinc-200 p-6">
                            <div className="flex items-start justify-between">
                                <h1 className="text-3xl font-bold text-zinc-900">
                                    {project.name}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Deadline: {project.deadline}
                                </p>
                            </div>

                            <h1>{project.description}</h1>

                            <div className="mt-4">
                                <p className="mb-1 text-sm text-zinc-700">
                                    Progress: {project.progress}%
                                </p>

                                <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full bg-accent transition-all duration-300"
                                        style={{
                                            width: `${project.progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
