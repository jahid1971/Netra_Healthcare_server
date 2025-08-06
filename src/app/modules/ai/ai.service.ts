import { callOpenRouterAI } from "../../services/openRouterService";

const getSpecialistSuggestion = async (
    symptoms: string,
    specialties: string[]
) => {
    const specialtiesList =
        specialties && specialties.length
            ? `Available specialties: ${specialties.join(", ")}`
            : "";

    // Use single quotes for the prompt string to avoid issues with backticks in comments
    const prompt =
        'Symptoms details: ' +
        symptoms +
        '. SpecialtiesList: ' +
        specialtiesList +
        '. From the SpecialtiesList, suggest the most relevant specialty (if any) to the symptoms details. If a relevant specialty is found, set both availableSpecialty and requiredSpecialty to the matched specialty. If no relevant specialty is found, set availableSpecialty: null and requiredSpecialty to your suggestion. Respond ONLY with a raw JSON object, without any code block, markdown, or explanation. Do not include triple backticks (```) or any extra text.';

    let aiResult;
    try {
        const rawResult = await callOpenRouterAI(prompt);

        if (!rawResult || rawResult.trim() === "") {
            throw new Error("Empty or invalid response from AI service");
        }

        // Remove code block markers and trim
        const cleaned = rawResult.replace(/```[a-zA-Z]*\n?|```/g, "").trim();

        aiResult = JSON.parse(cleaned);
    } catch (error) {
       
   
        aiResult = {
            message:
                "Unable to process the request at the moment. Please try again later.",
            availableSpecialty: null,
            requiredSpecialty: null,
        };
    }

    console.log("AI Result: ------------------------", aiResult);
    return aiResult;
};

export const AiService = {
    getSpecialistSuggestion,
};
