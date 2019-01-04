import { compose } from 'glue';
import { get } from './manifest';

const init = async () => {
  const server = await compose(
    get('/'),
    { relativeTo: __dirname }
  );
  await server.start();
  server.log(
    'info',
    `Server running on ${server.settings.uri}:${server.settings.port}`
  );
};

export { init };
