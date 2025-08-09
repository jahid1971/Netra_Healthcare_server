import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_SITE_URL = process.env.CLIENT_BASE_URL;
const OPENROUTER_SITE_NAME =  "Netra Healthcare";

export async function callOpenRouterAI(prompt: string) {
    const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model: "deepseek/deepseek-r1-0528:free",
            messages: [
                { role: "user", content: prompt }
            ],
            max_tokens: 200,
        },
        {
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": OPENROUTER_SITE_URL,
                "X-Title": OPENROUTER_SITE_NAME,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data.choices[0].message.content;
}
