import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models?key=" +
            process.env.GEMINI_API_KEY
        );

        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "REST fetch failed" },
            { status: 500 }
        );
    }
}