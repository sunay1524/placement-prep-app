"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session || !session.user?.id) {
    throw new Error("You must be logged in to post an experience.");
  }

  const title = (formData.get("title") as string) || "";
  const inputCompany = formData.get("company") as string;
  const roleTitle = formData.get("role") as string;
  const ctc = formData.get("ctc") as string;
  const locationInput = formData.get("locations") as string;
  const description = (formData.get("description") as string) || "";
  const verdict = (formData.get("verdict") as string) || "Selected";
  const difficulty = (formData.get("difficulty") as string) || "Medium";
  const jobType = (formData.get("jobType") as string) || "Full-time";
  const roundsJSON = formData.get("roundsJSON") as string;

  if (!inputCompany || !roleTitle || !locationInput) {
    throw new Error("Company, Role, and Location are required.");
  }

  // Format Company Name cleanly (e.g. "google" -> "Google")
  const enteredCompany = inputCompany
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // 1. Find or create Company
  const company = await prisma.company.upsert({
    where: { company: enteredCompany },
    update: {},
    create: { company: enteredCompany },
  });

  // 2. Create Role linked to Company
  const role = await prisma.role.create({
    data: {
      title: roleTitle.trim(),
      ctc: ctc ? ctc.trim() : null,
      locations: locationInput.split(",").map((l) => l.trim()).filter(Boolean),
      companyId: company.id,
    },
  });

  // 3. Parse dynamic rounds (supports both JSON or native formData.getAll)
  let roundsData: Array<{ roundType: string; questions: string; details?: string }> = [];
  if (roundsJSON) {
    try {
      roundsData = JSON.parse(roundsJSON);
    } catch (e) {
      console.error("Failed to parse roundsJSON", e);
    }
  } else {
    const roundTypes = formData.getAll("roundType") as string[];
    const questionsList = formData.getAll("questions") as string[];
    const detailsList = formData.getAll("details") as string[];

    roundsData = roundTypes.map((rt, idx) => ({
      roundType: rt,
      questions: questionsList[idx] || "",
      details: detailsList[idx] || "",
    }));
  }

  // 4. Create Experience with nested rounds
  await prisma.experience.create({
    data: {
      title,
      description,
      verdict,
      difficulty,
      jobType,
      companyId: company.id,
      roleId: role.id,
      userId: session.user.id,
      rounds: {
        create: roundsData.map((round, idx) => ({
          roundNumber: idx + 1,
          roundType: round.roundType || `Round ${idx + 1}`,
          questions: round.questions || "",
          details: round.details || null,
        })),
      },
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
