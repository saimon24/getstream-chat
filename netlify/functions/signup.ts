import { Handler, HandlerEvent } from '@netlify/functions';
import { StreamChat } from 'stream-chat';

const { STREAM_KEY, STREAM_SECRET_KEY } = process.env;

const serverStreamClient = StreamChat.getInstance(
  STREAM_KEY!,
  STREAM_SECRET_KEY!
);

const handler: Handler = async (event: HandlerEvent, context: any) => {
  // Parse the body of the request
  const { email, id } = JSON.parse(event.body || '');

  // Make sure we got all data
  if (!email || !id) {
    return {
      statusCode: 400,
      body: 'Could not create user',
    };
  }

  try {
    await serverStreamClient.upsertUser({
      id,
      email,
      name: email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'User successfull crated.',
      }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: 'Could not create user.',
    };
  }
};

export { handler };
