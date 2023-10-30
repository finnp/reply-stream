export class ReplyStream {
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

export default async function streamReply(handler: (stream: ReplyStream) => Promise<void>) {
    const stream = new ReplyStream();
  
    handler(stream);
  
    return stream.toResponse();
  }
  