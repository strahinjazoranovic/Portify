import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

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

export function AdminCardProject({
    onOpenModal,
    onEditProject,
}: {
    onOpenModal: () => void;
    onEditProject: (project: Project) => void;
}) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);

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

    // Show status and if the deadline is missed + project.progress is less than 100 show missed project.status
    const getStatus = (project: Project) => {
        const now = new Date();
        const deadline = new Date(project.deadline);

        if (deadline < now && project.progress < 100) {
            return 'Missed';
        }

        return project.status;
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
            return 'font-semibold text-orange-500';
        }

        return 'text-zinc-600';
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteProject) return;

        try {
            await axios.delete(`/projects/${deleteProject.id}`);

            // remove from UI
            setProjects((prev) =>
                prev.filter((p) => p.id !== deleteProject.id),
            );

            setDeleteProject(null);
        } catch (err) {
            console.error('Failed to delete project:', err);
            return;
        }
    };

    return (
        <div className="mt-2 flex flex-wrap justify-center gap-6">
            {/* Loading template for when projects get fetched from the database */}
            {loading ? (
                <>
                    {/* Placeholder  for 3 project cards */}
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-[calc(50%-0.75rem)] max-w-2xl animate-pulse rounded-lg bg-white shadow-md"
                        >
                            <div className="relative">
                                <div className="absolute top-4 right-4 h-11 w-11 rounded-full bg-white shadow-md transition-all duration-300 hover:cursor-pointer"></div>
                            </div>

                            <div className="flex h-80 justify-center">
                                <div className="h-full w-full rounded-t-xl bg-gray-300"></div>
                            </div>

                            <div className="border-t border-zinc-200 p-6">
                                <div className="flex items-start justify-between">
                                    <div className="h-8 w-40 rounded-lg bg-gray-300"></div>
                                    <div className="h-4 w-32 rounded-lg bg-gray-300"></div>
                                </div>

                                <div className="mt-4">
                                    <div className="mb-2 h-6 w-32 rounded-lg bg-gray-300"></div>

                                    <div className="mt-4 flex items-start justify-between">
                                        <div className="mb-2 h-4 w-32 rounded-lg bg-gray-300"></div>
                                        <div className="mb-2 h-4 w-24 rounded-lg bg-gray-300"></div>
                                    </div>

                                    <div className="h-4 w-full rounded-full bg-gray-200">
                                        <div className="h-full w-1/2 rounded-full bg-gray-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for add card */}
                    <div className="w-[calc(50%-0.75rem)] max-w-2xl animate-pulse rounded-lg bg-white shadow-md">
                        <div className="flex h-full justify-center p-6">
                            <div className="h-80 w-80 rounded-full bg-gray-300" />
                        </div>
                    </div>
                </>
            ) : // If projects array is empty show this text
            projects.length === 0 ? (
                <h1 className="text-center text-4xl font-bold">
                    No projects found
                </h1>
            ) : (
                // Render a card for each project in the projects array
                <>
                    {projects.map((project) => {
                        const status = getStatus(project);

                        return (
                            <div
                                key={project.id}
                                className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white shadow-md"
                            >
                                {/* Edit Icon */}
                                <div className="relative">
                                    <img
                                        src="/icons/editIcon.svg"
                                        className="absolute top-4 right-4 z-20 h-11 w-11 rounded-full bg-white shadow-md transition-all duration-300 hover:cursor-pointer"
                                        alt="edit"
                                        onClick={() =>
                                            setOpenMenuId(
                                                openMenuId === project.id
                                                    ? null
                                                    : project.id,
                                            )
                                        }
                                    />

                                    {/* If the menu is open show the code here below */}
                                    {openMenuId === project.id && (
                                        <div className="absolute top-16 right-4 z-20 w-32 rounded-lg border border-zinc-200 bg-white shadow-lg">
                                            <button
                                                className="block w-full px-4 py-2 text-left text-zinc-500 hover:bg-zinc-100"
                                                onClick={() => {
                                                    onEditProject(project);
                                                }}
                                            >
                                                Bewerk
                                            </button>

                                            <button
                                                className="block w-full px-4 py-2 text-left text-red-500 hover:bg-zinc-100"
                                                onClick={() => {
                                                    setDeleteProject(project);
                                                    setOpenMenuId(null);
                                                }}
                                            >
                                                Verwijder
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex h-80 justify-center">
                                    {project.logo && (
                                        <img
                                            src={project.logo}
                                            alt={project.name}
                                            className="object-cover/90 h-full w-full rounded-t-xl"
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

                                    <h1 className="mt-2 text-zinc-500">
                                        {project.description}
                                    </h1>

                                    {/* Text for progress and status above the progress bar */}
                                    <div className="mt-4">
                                        <div className="flex justify-between">
                                            <p className="text-md mb-1 text-zinc-600">
                                                Voortgang: {project.progress}%
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

                                        {/* Show an bar for progress*/}
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
                    })}

                    {/* Add project modal */}
                    <div className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white shadow-md">
                        <div
                            className="flex h-full justify-center p-6 transition-transform duration-300 hover:-translate-y-[4px] hover:cursor-pointer"
                            onClick={onOpenModal}
                        >
                            <img
                                src="/icons/addIcon.svg"
                                className="h-110"
                                draggable="false"
                            />
                        </div>
                    </div>

                    {/* Delete project modal */}
                    {deleteProject && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-zinc-900">
                                    Bevestig verwijdering
                                </h2>

                                <p className="mt-2 text-zinc-600">
                                    Weet je zeker dat je{' '}
                                    <span className="font-semibold">
                                        {deleteProject.name}
                                    </span>{' '}
                                    wilt verwijderen?
                                </p>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        className="bg-red-500"
                                        onClick={() => setDeleteProject(null)}
                                    >
                                        Nee
                                    </Button>

                                    <Button className="" onClick={handleDelete}>
                                        Ja, vewijder
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
