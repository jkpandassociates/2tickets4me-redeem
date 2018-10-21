import { compose } from 'glue';
import { get } from './manifest';

export default function initialize() {
  compose(
    get('/'),
    { relativeTo: __dirname },
    (_, server) => {
      const web: typeof server = <any>server.select('web');
      server.start(() =>
        server.log('info', 'Server running at: ' + web.info.uri)
      );
    }
  );
}
