import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });

  return Response.json(images);
}
