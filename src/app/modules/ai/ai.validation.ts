import { z } from "zod";

const suggestSpecialist = z.object({
    symptoms: z.string({ required_error: "Symptoms are required" }).min(3),
    specialties: z.array(z.string()).optional(),
});

export const AiValidation = {
    suggestSpecialist,
};
