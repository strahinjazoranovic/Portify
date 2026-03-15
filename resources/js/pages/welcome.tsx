import { Head, Link, usePage } from '@inertiajs/react';
import { login, register } from '@/routes';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex h-screen">
                <div className="flex w-1/2 items-center justify-center">
                    <img src="/logo.png" className="h-60 w-60 object-cover" />
                </div>
                <div className="flex w-1/2 flex-col items-center justify-center gap-4 border-l-3 border-zinc-600 bg-card pb-8">
                    <div className="">
                        <h1 className="overflow-hidden text-8xl font-extrabold text-[#1b1b18]">
                            Portify
                        </h1>
                        <p className="mb-2 text-3xl text-[#1b1b18]">
                            Jouw project, altijd inzichtelijk
                        </p>
                        {/* Send the user to /admin/dashboard if he is an admin otherwise send the user to /dashboard*/}
                        {auth.user ? (
                            <Link
                                href={
                                    auth.user.role === 'Admin'
                                        ? '/admin/dashboard'
                                        : '/dashboard'
                                }
                                className="inline-block w-50 rounded-sm border border-transparent bg-accent px-5 py-1.5 text-center text-xl leading-normal text-[#1b1b18] transition-transform duration-300 hover:-translate-y-[2px]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="mr-2 inline-block w-50 rounded-sm border border-transparent bg-accent px-5 py-1.5 text-center text-xl leading-normal text-[#1b1b18] transition-transform duration-300 hover:-translate-y-[2px]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block w-50 rounded-sm border border-transparent bg-accent px-5 py-1.5 text-center text-xl leading-normal text-[#1b1b18] transition-transform duration-300 hover:-translate-y-[2px]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
