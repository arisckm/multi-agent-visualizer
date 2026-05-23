import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        console.log("GEMINI KEY OK:", !!process.env.GEMINI_API_KEY);

        // Destructure fields sent by your workflow store
        const { role, label, description, intelligence, input } = await req.json();

        // Convert UI intelligence slider (0-100) safely to Gemini temperature range (0.0 - 1.0)
        const modelTemperature = Math.min(Math.max((intelligence || 50) / 100, 0), 1);

        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite", // Directly locked to flash since you don't need a dropdown
            generationConfig: {
                temperature: modelTemperature
            }
        });

        const prompt = `
You are operating as an internal autonomous pipeline agent node.

Operational Label: ${label || "Unnamed Node"}
Functional Role: ${role}
Context / Guidelines: ${description || input || "Execute standard processing algorithms."}

Task: Provide a highly realistic, brief, technical terminal diagnostic log snippet detailing your current automated action.
Constraints: Keep it strictly to 1-2 sentences. Look like a true developer console log output. No chat preamble, no markdown formatting blocks, no conversational explanations.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const outputText = response.text();

        return NextResponse.json({
            success: true,
            output: outputText.trim(),
        });

    } catch (error: any) {
        console.error("GEMINI ERROR:", error);

        return NextResponse.json(
            { success: false, error: error.message || "Internal loop execution failure" },
            { status: 500 }
        );
    }
}