export default function background({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-zinc-100 flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4">
            {children}
        </div>
    );
}
