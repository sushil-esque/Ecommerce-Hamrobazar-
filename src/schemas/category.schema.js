 import {z} from "zod"
 export  const categorySchema = z.object({
    name: z
      .string()
      .trim()
      .min(4, "Category name must be between 4 and 50 characters")
      .max(50, "Category name must be between 4 and 50 characters"),
  });