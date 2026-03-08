export default function background({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-zinc-100 flex flex-col h-full overflow-x-auto">
            {children}
        </div>
    );
}