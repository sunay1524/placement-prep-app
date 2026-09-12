"use server";

import { signIn, signOut } from "@/auth"

import bcrypt from "bcryptjs"
import { prisma } from '@/lib/prisma';
import { redirect } from "next/navigation";
import { error } from "console";

export async function signUp(formData: FormData) {

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!name || !email || !password) {
        throw new Error("Missing fields");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    });

    redirect("/sign-in");
}

export async function signInUser(formData: FormData) {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        throw new Error("Missing fields");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || !user.password) {
        throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new Error("Invalid password");
    }

    await signIn("credentials", {
        email,
        password,
        redirectTo: "/dashboard",
    });
}

export async function logout() {
    await signOut();
    redirect("/");
}

export async function signInwithGit() {
    await signIn("github", { redirectTo: "/dashboard" });
}