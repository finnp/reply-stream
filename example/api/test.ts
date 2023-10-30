export const config = {
  runtime: "edge",
};

class ReplyStream {
  private controller?: ReadableStreamDefaultController;
  private encoder: TextEncoder;

  constructor() {
    this.encoder = new TextEncoder();
  }

  private streamInit = {
    start: (controller: ReadableStreamDefaultController) => {
      this.controller = controller;
    },
    cancel: () => {
      this.close();
    },
  };

  private readable: ReadableStream = new ReadableStream(this.streamInit);

  send(data: any) {
    if (!this.controller) {
      throw new Error("Stream not started yet.");
    }
    const jsonString = "data: " + JSON.stringify(data) + "\n\n";
    this.controller.enqueue(this.encoder.encode(jsonString));
  }

  close() {
    if (this.controller) {
      this.controller.close();
    }
  }

  toResponse() {
    return new Response(this.readable, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8" },
    });
  }
}

export default async () =>
  streamReply(async (stream) => {
    stream.send({});
    await delay(500);
    stream.send({ a: 1 });
    await delay(3000);
    stream.send({ a: 2 });
  });

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function streamReply(handler: (stream: ReplyStream) => Promise<void>) {
  const stream = new ReplyStream();

  handler(stream);

  return stream.toResponse();
}
