import { FastifyPluginAsync } from 'fastify';

const route: FastifyPluginAsync = async (app) => {
  app.post('/transcribe', async (req, reply) => {
    const file = await (req as any).file();
    if (!file)
      return reply.code(400).send({ error: 'Missing audio (field "audio")' });

    if (!app.hasOpenAI) {
      return reply.send({
        text: 'Mock transcript: talked about Acme renewal on Friday.',
      });
    }

    const r = await app.openai!.audio.transcriptions.create({
      file: file.file,
      model: 'gpt-4o-mini-transcribe',
    });
    return reply.send({ text: (r as any).text });
  });
};

export default route;
