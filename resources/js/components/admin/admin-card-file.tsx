import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type Files = {
    id: number;
    name: string;
    description: string;
    path: string;
};

export function AdminCardFile() {
    const [files, setFiles] = useState<Files[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await fetch('/files');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: Files[] = await res.json();
                setFiles(data);
                // console.log('Fetched files:', data);
            } catch (err) {
                console.error('Failed to fetch files:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div className="mt-2 flex flex-wrap gap-6">
            {loading ? (
                // Skeleton Loader
                Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="w-[calc(33%-0.75rem)] max-w-2xl animate-pulse rounded-lg bg-white shadow-md"
                    >
                        <div className="border-t border-zinc-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="h-8 w-40 rounded-lg bg-gray-300"></div>
                                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                            </div>

                            <div className="mt-4">
                                <div className="mb-2 h-4 w-32 rounded-lg bg-gray-300"></div>
                            </div>

                            <div className="mt-4 h-12 w-full rounded-lg bg-gray-300"></div>
                        </div>
                    </div>
                ))
            ) : files.length === 0 ? (
                <h1 className="text-center text-xl">No active files found</h1>
            ) : (
                files.map((file) => (
                    <div
                        key={file.id}
                        className="w-[calc(33%-0.75rem)] max-w-2xl gap-4 rounded-lg bg-white p-4 shadow-md"
                    >
                        <div className="">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-bold text-zinc-900">
                                    {file.name}
                                </h1>
                                <div>
                                    <img
                                        src="/icons/fileIcon.svg"
                                        alt="FileIcon"
                                    ></img>
                                </div>
                            </div>

                            <h1 className="mt-2">{file.description}</h1>
                        </div>
                        <a href={file.path} download>
                            <Button className="mt-4 w-full">Download</Button>
                        </a>
                    </div>
                ))
            )}
        </div>
    );
}
