"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function QueryToast({
  id,
  title,
  description,
  type = "success",
}: {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "info" | "warning" | "error";
}) {
  useEffect(() => {
    const options = { id, description };

    if (type === "error") {
      toast.error(title, options);
    } else if (type === "warning") {
      toast.warning(title, options);
    } else if (type === "info") {
      toast.info(title, options);
    } else {
      toast.success(title, options);
    }
  }, [description, id, title, type]);

  return null;
}
