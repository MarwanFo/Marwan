import * as fs from "fs";
import * as path from "path";

async function listModels() {
    const envContent = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
    const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

    if (!apiKey) {
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        const models = data.models || [];
        console.log("Available Models:");
        models.forEach((m: any) => {
            console.log(`- ${m.name} (${m.displayName})`);
        });
    } catch (e: any) {
        console.error("List models failed:", e.message);
    }
}

listModels();
