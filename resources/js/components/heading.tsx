export default function Heading({
    title,
    description,
    variant = 'default',
}: {
    title: string;
    description?: string;
    variant?: 'default' | 'small';
}) {
    return (
        <header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2
                className={
                    variant === 'small'
                        ? 'mb-0.5 text-base text-zinc-600 font-semibold'
                        : 'text-xl text-zinc-600 font-semibold tracking-tight'
                }
            >
                {title}
            </h2>
            {description && (
                <p className="text-sm text-zinc-500">{description}</p>
            )}
        </header>
    );
}
