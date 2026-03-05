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

type NextDeadline = {
    name: string;
    daysLeft: number;
};

function getDaysUntilDeadline(deadline: string): number {
    const today = new Date();
    const dueDate = new Date(deadline);

    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function UserCardDeadline() {
    const [nextDeadline, setNextDeadline] = useState<NextDeadline | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/projects');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: Project[] = await res.json();

                // Find upcoming projects
                const upcomingProjects = data
                    .map((project) => ({
                        name: project.name,
                        daysLeft: getDaysUntilDeadline(project.deadline),
                    }))
                    .filter((project) => project.daysLeft >= 0);

                if (upcomingProjects.length === 0) {
                    setNextDeadline(null);
                    return;
                }

                // Find closest deadline
                const closest = upcomingProjects.reduce((prev, current) =>
                    current.daysLeft < prev.daysLeft ? current : prev,
                );

                setNextDeadline(closest);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white p-6 pt-8 pb-8 shadow-md">
            {loading ? (
                // Skeleton Loader
                <>
                    {Array.from({ length: 1 }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full max-w-2xl animate-pulse rounded-lg bg-white shadow-md"
                        >
                            <div className="flex items-start justify-between">
                                <div className="h-7 w-full rounded bg-gray-300"></div>
                            </div>
                        </div>
                    ))}
                </>
            ) : !nextDeadline ? (
                <h1 className="text-xl">No upcoming deadlines</h1>
            ) : nextDeadline.daysLeft === 0 ? (
                <h1 className="text-xl">
                    Next deadline: {nextDeadline.name} is due{' '}
                    <span className="font-bold text-zinc-600">today</span>
                </h1>
            ) : (
                <h1 className="text-xl font-semibold">
                    Next deadline: {nextDeadline.name} in{' '}
                    <span className="font-bold text-zinc-600">
                        {nextDeadline.daysLeft} days
                    </span>
                </h1>
            )}
        </div>
    );
}
