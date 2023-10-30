export const config = {
  runtime: "edge",
};

export default async function handler() {
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("{}\n"));
      await delay(500);
      controller.enqueue(encoder.encode(`{"a": 1}\n`));
      await delay(500);
      controller.enqueue(encoder.encode(`{"a": 2}\n`));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
