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
    timeLeft: number;
    unit: 'days' | 'hours';
};

function getTimeUntilDeadline(deadline: string): NextDeadline | null {
    const now = new Date();
    const dueDate = new Date(deadline);

    const diffMs = dueDate.getTime() - now.getTime();

    if (diffMs < 0) return null;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 24) {
        return {
            name: '',
            timeLeft: diffHours,
            unit: 'hours',
        };
    }

    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return {
        name: '',
        timeLeft: diffDays,
        unit: 'days',
    };
}

export function UserCardDeadline() {
    const [nextDeadline, setNextDeadline] = useState<NextDeadline | null>(null);
    const [projectName, setProjectName] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/projects');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: Project[] = await res.json();

                const upcoming = data
                    .map((project) => {
                        const now = new Date();
                        const deadline = new Date(project.deadline);
                        const diff = deadline.getTime() - now.getTime();

                        return {
                            name: project.name,
                            deadline,
                            diff,
                        };
                    })
                    .filter((p) => p.diff >= 0);

                if (upcoming.length === 0) {
                    setNextDeadline(null);
                    return;
                }

                const closest = upcoming.reduce((prev, current) =>
                    current.diff < prev.diff ? current : prev,
                );

                const time = getTimeUntilDeadline(closest.deadline.toISOString());

                if (time) {
                    setNextDeadline(time);
                    setProjectName(closest.name);
                }
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getUrgencyColor = () => {
        if (!nextDeadline) return 'text-zinc-600';

        if (nextDeadline.unit === 'hours') return 'text-red-500';
        if (nextDeadline.timeLeft <= 2) return 'text-orange-500';

        return 'text-zinc-600';
    };

    return (
        <div className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white p-6 pt-8 pb-8 shadow-md">
            {loading ? (
                <div className="animate-pulse">
                    <div className="h-7 w-3/4 rounded bg-gray-300"></div>
                </div>
            ) : !nextDeadline || !projectName ? (
                <h1 className="text-xl">No upcoming deadlines</h1>
            ) : nextDeadline.timeLeft === 0 ? (
                <h1 className="text-xl font-semibold">
                    Next deadline: {projectName} is due{' '}
                    <span className="font-bold text-red-500">now</span>
                </h1>
            ) : (
                <h1 className="text-xl font-semibold">
                    Next deadline: {projectName} in{' '}
                    <span className={`font-bold ${getUrgencyColor()}`}>
                        {nextDeadline.timeLeft}{' '}
                        {nextDeadline.unit === 'hours'
                            ? nextDeadline.timeLeft === 1
                                ? 'hour'
                                : 'hours'
                            : nextDeadline.timeLeft === 1
                            ? 'day'
                            : 'days'}
                    </span>
                </h1>
            )}
        </div>
    );
}