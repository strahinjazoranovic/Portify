import { useEffect, useState } from 'react';

// Define Project
type Project = {
    id: number;
    name: string;
    status: string;
    description: string;
    deadline: string;
    user_id?: string;
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

                data.sort(
                    (a, b) =>
                        new Date(a.deadline).getTime() -
                        new Date(b.deadline).getTime(),
                );

                setProjects(data);
                // console.log('Fetched projects:', data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Format deadline in days and hours
    const formatDeadline = (deadlineString: string) => {
        const now = new Date();
        const deadline = new Date(deadlineString);

        const diffMs = deadline.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

        if (diffHours < 0) {
            return 'Deadline passed';
        }

        if (diffHours < 24) {
            return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
        }

        return deadline.toLocaleDateString();
    };

    // If the time is lower than a certain value red text color gets shown
    const getDeadlineColor = (project: Project) => {
        const now = new Date();
        const deadline = new Date(project.deadline);

        const diff = deadline.getTime() - now.getTime();
        const status = getStatus(project);

        if (diff < 0) {
            return status === 'Finished' ? 'text-green-600' : 'text-red-500';
        }

        if (diff < 86400000) {
            return 'text-orange-500';
        }

        return 'text-zinc-600';
    };

    // Show status and if the deadline is missed + project.progress is less than 100 show missed project.status
    const getStatus = (project: Project) => {
        const now = new Date();
        const deadline = new Date(project.deadline);

        if (deadline < now && project.progress < 100) {
            return 'Missed';
        }

        return project.status;
    };

    return (
        <div className="mt-2 flex flex-wrap justify-center gap-6">
            {/* Loading template for when projects get fetched from the database */}
            {loading ? (
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
                                <div className="h-8 w-40 rounded-lg bg-gray-300"></div>
                                <div className="h-4 w-24 rounded-lg bg-gray-300"></div>
                            </div>

                            <div className="mt-4">
                                <div className="mb-2 h-4 w-32 rounded-lg bg-gray-300"></div>

                                <div className="flex items-start justify-between">
                                    <div className="mb-2 h-4 w-32 rounded-lg bg-gray-300"></div>
                                    <div className="mb-2 h-4 w-24 rounded-lg bg-gray-300"></div>
                                </div>

                                <div className="h-4 w-full rounded-full bg-gray-200">
                                    <div className="h-full w-1/2 rounded-full bg-gray-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : // If projects array is empty show this
            projects.length === 0 ? (
                <h1 className="text-center text-xl">
                    No active projects found
                </h1>
            ) : (
                // Render a card for each project in the projects array
                projects.map((project) => {
                    const status = getStatus(project);

                    return (
                        <div
                            key={project.id}
                            className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white shadow-md"
                        >
                            <div className="flex h-50 justify-center p-6">
                                {project.logo && (
                                    <img
                                        src={project.logo}
                                        alt={project.name}
                                    />
                                )}
                            </div>

                            <div className="border-t border-zinc-200 p-6">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-bold text-zinc-900">
                                        {project.name}
                                    </h1>

                                    <p
                                        className={`text-md ${getDeadlineColor(project)}`}
                                    >
                                        <span className="text-md text-zinc-600">
                                            Deadline:{' '}
                                        </span>
                                        {formatDeadline(project.deadline)}
                                    </p>
                                </div>

                                <h1 className="mt-2">{project.description}</h1>

                                <div className="mt-4">
                                    <div className="flex justify-between">
                                        <p className="text-md mb-1 text-zinc-600">
                                            Progress: {project.progress}%
                                        </p>

                                        <p
                                            className={`text-md ${
                                                status === 'Missed'
                                                    ? 'text-red-500'
                                                    : 'text-green-600'
                                            }`}
                                        >
                                            <span className="text-md text-zinc-600">
                                                Status:{' '}
                                            </span>
                                            {status}
                                        </p>
                                    </div>

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
                    );
                })
            )}
        </div>
    );
}
