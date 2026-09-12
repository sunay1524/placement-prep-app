"use client";

import { useState } from "react";
import { deleteExperience } from "@/app/experience/experience-actions";
import { useRouter } from "next/navigation";

interface DeleteExperienceButtonProps {
  experienceId: string;
  redirectToDashboard?: boolean;
}

export default function DeleteExperienceButton({
  experienceId,
  redirectToDashboard = false,
}: DeleteExperienceButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      setIsDeleting(true);
      await deleteExperience(experienceId);
      if (redirectToDashboard) {
        router.push("/dashboard");
      } else {
        router.refresh();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete experience.");
      setIsDeleting(false);
      setIsConfirming(false);
    }
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsConfirming(false);
  }

  if (isConfirming) {
    return (
      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 px-2.5 py-1 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
        >
          {isDeleting ? "Deleting..." : "Confirm"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isDeleting}
          className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs font-medium text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1 p-1 rounded-md hover:bg-rose-50"
      title="Delete Experience"
    >
      <span>🗑️</span>
      <span>Delete</span>
    </button>
  );
}
