import fastify, { FastifyPluginAsync } from 'fastify';
import common from '../src/schemas/common';

import {
  TaskRunner,
} from 'graasp-test';

type props = {
  runner: TaskRunner;
  plugin: FastifyPluginAsync;
};

const build = async ({
  plugin,
  runner,
}: props) => {
  const app = fastify({
    ajv: {
      customOptions: {
        // This allow routes that take array to correctly interpret single values as an array
        // https://github.com/fastify/fastify/blob/main/docs/Validation-and-Serialization.md
        coerceTypes: 'array',
      },
    },
  });

  app.addSchema(common);

  app.decorate('taskRunner', runner);

  await app.register(plugin, {});

  return app;
};
export default build;