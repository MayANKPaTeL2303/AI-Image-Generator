import {NextResponse} from 'next/server';
import { prisma } from "@/lib/prisma";


export async function POST(req:Request) {
    try {
        const { prompt } = await req.json();
        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const pyRes = await fetch("http://localhost:8000/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        }); 

        if( !pyRes.ok ) {
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
        }

        const data = await pyRes.json();

        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 500 });
        }

        const imageUrl = data.imageUrl || `data:image/png;base64,${data.imageBase64}`;

         // Save to database
        const newImage = await prisma.image.create({
        data: {
            prompt,
            imageUrl,
        },
        });

        return NextResponse.json(newImage, { status: 201 });
    }
    catch (error) {
        console.error("POST /generate-image error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

