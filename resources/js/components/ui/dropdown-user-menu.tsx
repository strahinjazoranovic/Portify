import axios from 'axios';
import { useEffect, useState } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
};

interface DropdownUserMenuProps {
    value: string;
    onChange: (userId: string) => void;
    label?: string; // optional label prop
}

export function DropdownUserMenu({ value, onChange, label = "Voeg klanten toe aan het project" }: DropdownUserMenuProps) {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        axios
            .get('/users')
            .then((res) => setUsers(res.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="flex flex-col">
            <label className="text-[15px] text-[#1b1b18] font-medium" htmlFor="user-select">
                {label}
            </label>
            <select
                id="user-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-2 bg-white h-11 w-full rounded-md border border-zinc-400 p-2"
            >
                <option value="">Kies een gebruiker</option>
                {users.map((user) => (
                    <option key={user.id} value={user.id}>
                        {user.name}
                    </option>
                ))}
            </select>
        </div>
    );
}