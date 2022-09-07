import { Handler, HandlerEvent } from '@netlify/functions';
import { StreamChat } from 'stream-chat';

const { STREAM_KEY, STREAM_SECRET_KEY } = process.env;

const serverStreamClient = StreamChat.getInstance(
  STREAM_KEY!,
  STREAM_SECRET_KEY!
);

const handler: Handler = async (event: HandlerEvent, context: any) => {
  console.log('IN CF');

  // Parse the body of the request
  const { id } = JSON.parse(event.body || '');

  // Make sure we got all data
  if (!id) {
    return {
      statusCode: 400,
      body: 'Could not create user',
    };
  }

  try {
    const token = await serverStreamClient.createToken(`${id}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (e) {
    console.log('create token failed: ', e);

    return {
      statusCode: 500,
      body: 'Could not create user.',
    };
  }
};

export { handler };
