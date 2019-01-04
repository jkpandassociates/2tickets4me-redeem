import { join } from 'path';
import { existsSync } from 'fs';
import { init } from './init';

if (
  existsSync(
    join(
      __dirname /* src|dist */,
      '..' /* server */,
      '..' /* packages */,
      '..' /* root */,
      '.env'
    )
  )
) {
  require('dotenv').config(); // Load environment variables
}

init();
