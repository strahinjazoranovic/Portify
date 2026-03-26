// import { useEffect, useState } from 'react';
// import { usePage } from '@inertiajs/react';
// import type { SharedData } from '@/types';
import { Button } from '@/components/ui/button';


// type Messages = {
//     id: number;
//     messages: string;
//     is_read: boolean;
// };

export function UserHeaderMessage() {
    // const [messages, setMessages] = useState<Messages[]>([]);
    // const [loading, setLoading] = useState(true);
    // const { auth } = usePage<SharedData>().props;

    // useEffect(() => {
    //     const fetchMessages = async () => {
    //         try {
    //             const res = await fetch('/messages');

    //             if (!res.ok) {
    //                 throw new Error(`HTTP error! status: ${res.status}`);
    //             }

    //             const data: Messages[] = await res.json();
    //             setMessages(data);
    //             console.log('Fetched messages:', data);
    //         } catch (err) {
    //             console.error('Failed to fetch messages:', err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchMessages();
    // }, []);

    return (
        <div className="flex h-25 w-full items-center justify-between border-b border-zinc-200 bg-white pt-8 pr-8 pb-8 pl-8 shadow-md">
            <div className="mr-7 flex w-60 items-center rounded-md border border-zinc-300 bg-[#E2E2E2] px-3 py-2">
                <img src="/icons/searchIcon.svg" className="mr-2 h-4 w-4" />

                <input
                    type="text"
                    placeholder="Zoek naam, chat etc"
                    className="w-full outline-none"
                />
            </div>
            {/* <h1>Strahinja Zoranovic</h1> */}
                <Button className="text-md w-60">Nieuw bericht</Button>
        </div>
    );
}
