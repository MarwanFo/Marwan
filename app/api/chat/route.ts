import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMarwanContext } from "@/lib/ai-context";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();

        console.log(`[Marwan-AI]: New request received at ${new Date().toISOString()}`);
        console.log("[Marwan-AI]: Message:", message?.substring(0, 30));

        if (!process.env.GEMINI_API_KEY) {
            console.error("[Marwan-AI Error]: GEMINI_API_KEY is null");
            return NextResponse.json(
                { error: "AI key is missing. Please add GEMINI_API_KEY to your .env.local" },
                { status: 500 }
            );
        }

        // Initialize inside to catch env issues
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using 2.5 flash as it has active quota on this key
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // 1. Get database context
        let context = "";
        try {
            context = await getMarwanContext();
            console.log("[Marwan-AI]: Context loaded successfully");
        } catch (ctxError: any) {
            console.error("[Marwan-AI Error]: Failed to load context:", ctxError.message || ctxError);
            return NextResponse.json({ error: "Failed to fetch portfolio data." }, { status: 500 });
        }

        // 2. Start chat
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: context }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am Marwan's professional assistant. How can I help you today?" }],
                },
                ...(history || []),
            ],
        });

        // 3. Generate response
        try {
            const result = await chat.sendMessage(message);
            const response = await result.response;
            const text = response.text();
            
            console.log("[Marwan-AI]: Response generated successfully");
            return NextResponse.json({ text });
        } catch (genError: any) {
            const errorMessage = genError.message || "";
            if (errorMessage.includes("429") || errorMessage.includes("quota")) {
                console.error("[Marwan-AI Error]: Quota exceeded (429)");
                return NextResponse.json({ 
                    error: "The AI is a bit overwhelmed! Please wait about 60 seconds and try again. (Free Tier Limit reached)" 
                }, { status: 429 });
            }
            
            console.error("[Marwan-AI Error]: Generation failed:", errorMessage);
            return NextResponse.json({ 
                error: `AI Error: ${errorMessage.substring(0, 100)}...` 
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error("[Marwan-AI General Error]:", error);
        return NextResponse.json(
            { error: "Something went wrong while thinking..." },
            { status: 500 }
        );
    }
}
