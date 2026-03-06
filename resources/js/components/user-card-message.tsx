// import { useEffect, useState } from 'react';

// type Messages = {
//     id: number;
//     messages: string;
//     is_read: boolean;
// };

export function UserCardMessage() {
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
        <div></div>
        // <div className="mt-2 flex flex-wrap justify-center gap-6">
        //     {loading ? (
        //         // Skeleton Loader
        //         Array.from({ length: 1 }).map((_, index) => (
        //             <div
        //                 key={index}
        //                 className="w-[calc(50%-0.75rem)] max-w-2xl animate-pulse rounded-lg bg-white shadow-md"
        //             >
        //                 <div className="border-t border-zinc-200 p-6">
        //                     <div className="flex items-start justify-between">
        //                         <div className="h-6 w-40 rounded-lg bg-gray-300"></div>
        //                     </div>

        //                     <div className="mt-4">
        //                         <div className="mb-2 h-3 w-32 rounded-lg bg-gray-300"></div>
        //                     </div>
        //                 </div>
        //             </div>
        //         ))
        //     ) : messages.length === 0 ? (
        //         <h1 className="text-center text-xl">No messages</h1>
        //     ) : (
        //         messages.map((message) => (
        //             <div
        //                 key={message.id}
        //                 className="w-[calc(50%-0.75rem)] max-w-2xl rounded-lg bg-white shadow-md"
        //             >
        //                 <div className="border-t border-zinc-200 p-6">
        //                     <div className="flex items-start justify-between">
        //                         <h1 className="text-3xl font-bold text-zinc-900">
        //                             {message.messages}
        //                         </h1>
        //                     </div>

        //                     <h1>{message.is_read ? 'Read' : 'Unread'}</h1>
        //                 </div>
        //             </div>
        //         ))
        //     )}
        // </div>
    );
}
