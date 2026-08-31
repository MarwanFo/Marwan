import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

async function listModels() {
    const envContent = fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf-8");
    const apiKeyMatch = envContent.match(/GEMINI_API_KEY=(.*)/);
    const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : null;

    if (!apiKey) {
        console.error("No API key found in .env.local");
        return;
    }

    console.log("Using API Key:", apiKey.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Testing specific models
    const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-1.5-pro", "gemini-pro"];

    for (const modelName of modelsToTest) {
        try {
            console.log(`Checking ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });
            // Using a simple prompt
            const result = await model.generateContent("test");
            const response = await result.response;
            console.log(`${modelName} works! Response:`, response.text().substring(0, 20));
        } catch (e: any) {
            console.error(`${modelName} failed:`, e.message);
        }
    }
}

listModels();
