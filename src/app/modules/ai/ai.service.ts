import { callOpenRouterAI } from "../../services/openRouterService";

const getSpecialistSuggestion = async (
    symptoms: string,
    specialties: string[]
) => {
    const specialtiesList =
        specialties && specialties.length
            ? `Available specialties: ${specialties.join(", ")}.`
            : "";
    const prompt = `Given the following symptoms from a patient: ${symptoms}. ${specialtiesList} \nSuggest the most relevant specialties from the list (if any), and provide a short, friendly message for the patient. \nIf there is no relevant match, reply with a standard message for the patient and an empty array.\nReturn your response as a JSON object with keys 'message' and 'specialties'.`;

    let aiResult = await callOpenRouterAI(prompt);
    try {
        aiResult = JSON.parse(aiResult);
    } catch {
        aiResult = { message: aiResult, specialties: [] };
    }
    return aiResult;
};

export const AiService = {
    getSpecialistSuggestion,
};
