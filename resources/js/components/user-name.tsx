import type { User } from '@/types';

export function UserName({ user }: { user: User; showEmail?: boolean }) {
    return (
        <>
            <span className="text-5xl font-bold text-zinc-900">
                {user.name}
            </span>
        </>
    );
}
