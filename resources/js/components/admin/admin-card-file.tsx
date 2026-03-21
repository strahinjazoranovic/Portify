import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

type Files = {
    id: number;
    name: string;
    description: string;
    path: string;
};

export function AdminCardFile({
    onOpenModal,
    onEditFile,
}: {
    onOpenModal: () => void;
    onEditFile: (file: Files) => void;
}) {
    const [files, setFiles] = useState<Files[]>([]);
    const [loading, setLoading] = useState(true);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [deleteFile, setDeleteFile] = useState<Files | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const res = await fetch('/files');

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }

                const data: Files[] = await res.json();
                setFiles(data);
            } catch (err) {
                console.error('Failed to fetch files:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const handleDelete = async () => {
        if (!deleteFile) return;

        try {
            await axios.delete(`/files/${deleteFile.id}`);

            setFiles((prev) => prev.filter((f) => f.id !== deleteFile.id));

            setDeleteFile(null);
        } catch (err) {
            console.error('Failed to delete file:', err);
        }
    };

    return (
        <div className="mt-2 flex flex-wrap gap-6">
            {loading ? (
                <>
                    {Array.from({ length: 2 }).map((_, index) => (
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
                    ))}

                    <div className="w-[calc(33%-0.75rem)] max-w-2xl animate-pulse rounded-lg bg-white shadow-md">
                        <div className="flex h-full justify-center p-6">
                            <div className="h-30 w-30 rounded-full bg-gray-300" />
                        </div>
                    </div>
                </>
            ) : // If files array is empty show this text 
            files.length === 0 ? (
                <h1 className="text-center text-3xl font-bold">
                    No files found
                </h1>
            ) : (
                <>
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="w-[calc(33%-0.75rem)] max-w-2xl gap-4 rounded-lg bg-white p-4 shadow-md"
                        >
                            {/* Edit Icon */}
                            <div className="relative">
                                <img
                                    src="/icons/editIcon.svg"
                                    className="absolute top-0 right-0 h-11 w-11 rounded-full bg-white shadow-md transition-all duration-300 hover:cursor-pointer"
                                    alt="edit"
                                    onClick={() =>
                                        setOpenMenuId(
                                            openMenuId === file.id
                                                ? null
                                                : file.id,
                                        )
                                    }
                                />

                                {openMenuId === file.id && (
                                    <div className="absolute top-12 right-0 z-20 w-32 rounded-lg border border-zinc-200 bg-white shadow-lg">
                                        <button
                                            className="block w-full px-4 py-2 text-left text-zinc-500 hover:bg-zinc-100"
                                            onClick={() => {
                                                onEditFile(file);
                                            }}
                                        >
                                            Bewerk
                                        </button>

                                        <button
                                            className="block w-full px-4 py-2 text-left text-red-500 hover:bg-zinc-100"
                                            onClick={() => {
                                                setDeleteFile(file);
                                                setOpenMenuId(null);
                                            }}
                                        >
                                            Verwijder
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-start gap-3">
                                    <h1 className="text-3xl font-bold text-zinc-900">
                                        {file.name}
                                    </h1>
                                    <div>
                                        <img
                                            src="/icons/fileIcon.svg"
                                            alt="FileIcon"
                                        />
                                    </div>
                                </div>

                                <h1 className="mt-2 text-zinc-500">
                                    {file.description}
                                </h1>
                            </div>

                            <a
                                href={file.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                            >
                                <Button className="mt-4 w-full">
                                    Download bestand
                                </Button>
                            </a>
                        </div>
                    ))}

                    {/* Add new file */}
                    <div className="w-[calc(33%-0.75rem)] max-w-2xl rounded-lg bg-white shadow-md">
                        <div
                            className="flex h-full justify-center p-6 transition-transform duration-300 hover:-translate-y-[4px] hover:cursor-pointer"
                            onClick={onOpenModal}
                        >
                            <img
                                src="/icons/addIcon.svg"
                                className="h-30 w-30"
                                draggable="false"
                            />
                        </div>
                    </div>

                    {/* Delete modal */}
                    {deleteFile && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-zinc-900">
                                    Bevestig verwijdering
                                </h2>

                                <p className="mt-2 text-zinc-600">
                                    Weet je zeker dat je{' '}
                                    <span className="font-semibold">
                                        {deleteFile.name}
                                    </span>{' '}
                                    wilt verwijderen?
                                </p>

                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        className="bg-red-500"
                                        onClick={() => setDeleteFile(null)}
                                    >
                                        Nee
                                    </Button>

                                    <Button onClick={handleDelete}>
                                        Ja, verwijder
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
