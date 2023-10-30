import streamReply from "../../reply-stream";

export const config = {
  runtime: "edge",
};

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
