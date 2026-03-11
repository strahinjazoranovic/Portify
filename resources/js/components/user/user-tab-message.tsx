// import { useEffect, useState } from 'react';
import UserTabCardMessage from '@/components/user/user-tabCard-message';

// type Messages = {
//     id: number;
//     messages: string;
//     is_read: boolean;
// };

export function UserTabMessage() {
    // const [messages, setMessages] = useState<Messages[]>([]);
    // const [loading, setLoading] = useState(true);

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
        <div className="h-full w-75 bg-white pt-8 border-r border-zinc-200 shadow-md">
            <UserTabCardMessage/>
        </div>
    );
}
