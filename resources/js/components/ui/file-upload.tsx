import { useState, useRef } from "react";

interface FileUploadProps {
    onFileChange?: (file: File | null) => void;
    title?: string; 
    buttonText?: string;
}

export default function FileUpload({
    onFileChange,
    title = "Upload het logo",
    buttonText = "Kies logo",
}: FileUploadProps) {
    const [fileName, setFileName] = useState("Geen bestand gekozen");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.currentTarget.files?.[0] ?? null;

        if (file) {
            setFileName(file.name);
        }
        onFileChange?.(file);
    };

    const handleRemoveFile = () => {
        setFileName("Geen bestand gekozen");
        onFileChange?.(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-start gap-6">
                <h1 className="text-[15px] font-medium text-[#1b1b18]">
                    {title}
                </h1>

                {fileName !== "Geen bestand gekozen" && (
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-sm text-red-500 hover:text-red-600 cursor-pointer"
                    >
                        Verwijderen
                    </button>
                )}
            </div>

            <div className="mt-2 flex items-center gap-6">
                <label
                    htmlFor="fileUpload"
                    className="bg-white h-11 w-32 flex items-center px-3 rounded-md border border-zinc-400 cursor-pointer"
                >
                    {buttonText}
                </label>

                <span className="w-40 text-sm text-zinc-600">{fileName}</span>

                <input
                    ref={inputRef}
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
}