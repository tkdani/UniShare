// app/api/download/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const fileName = searchParams.get("fileName");

  if (!url || !fileName) return new Response("Missing params", { status: 400 });

  const response = await fetch(url);
  const blob = await response.blob();

  return new Response(blob, {
    headers: {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "application/octet-stream",
    },
  });
}
