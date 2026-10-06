import { z } from "zod";

export const fosterSchema = z.object({
  id: z.string(),
  name: z.string(),
  rescue: z.string(),
  image: z.string(),
  age: z.string().default(""),
  weight: z.string().default(""),
  breed: z.string().default(""),
  socialLink: z.string().default(""),
  about: z.string().default(""),
  adoptionLink: z.string().default(""),
  status: z.enum(["active", "past"]),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
});

export type Foster = z.infer<typeof fosterSchema>;

export const emptyFoster: Foster = {
  id: "",
  name: "",
  rescue: "",
  image: "",
  age: "",
  weight: "",
  breed: "",
  socialLink: "",
  about: "",
  adoptionLink: "",
  status: "active",
  startDate: "",
  endDate: "",
};
