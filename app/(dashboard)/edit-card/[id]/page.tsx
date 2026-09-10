"use client";
import { use } from "react";
import Link from "next/link";
import FosterForm from "../../components/foster-form";
import { useFosters } from "@/lib/fosters";
import FosterEditForm from "../../components/foster-edit-form";
export default function EditCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const foster = useFosters().find(item => item.id === id);
  return foster ? <FosterEditForm key={foster.id} foster={foster} /> : <div><h1 className="text-xl font-semibold">Card not found</h1><Link href="/home" className="mt-4 inline-block text-primary">Back to Home</Link></div>;
}
