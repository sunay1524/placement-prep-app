import { signInUser, signInwithGit } from "@/lib/auth-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
    const session = await auth();
    if (session && session.user) {
        redirect("/dashboard");
    }

    const { error } = await searchParams;

    let errorMessage = "";
    if (error === "OAuthAccountNotLinked") {
        errorMessage = "An account with this email address already exists. Please log in using your Email and Password.";
    } else if (error === "CredentialsSignin") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error) {
        errorMessage = "An error occurred during sign in. Please try again.";
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] w-full flex flex-col items-center p-8 relative top-14">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Log in to your Account !</h1>

            <div className="flex flex-col border border-slate-200 shadow-sm rounded-2xl p-8 gap-5 w-full max-w-md bg-white text-slate-900">
                {errorMessage && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                        {errorMessage}
                    </div>
                )}

                <form action={signInUser} className="flex flex-col gap-5">
                    <input name="email" type="email" placeholder="Email" required className="border border-zinc-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-900" />
                    <input name="password" type="password" placeholder="Password" required className="border border-zinc-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-slate-900" />
                    <button type="submit" className="bg-zinc-900 hover:bg-black text-white rounded-lg p-2.5 font-semibold transition-colors">Log In</button>
                </form>

                <p className="w-full flex justify-center text-sm text-slate-500">or</p>

                <form action={signInwithGit}>
                    <button type="submit" className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-lg p-2.5 font-semibold transition-colors flex items-center justify-center gap-2">
                        Sign in with Github
                    </button>
                </form>
            </div>
        </div>
    )
}