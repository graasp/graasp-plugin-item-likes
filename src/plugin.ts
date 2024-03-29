import { FastifyPluginAsync } from 'fastify';

import { ItemLikeService } from './db-service';
import common, { create, deleteOne, getLikeCount, getLikedItems } from './schemas/schemas';
import { TaskManager } from './task-manager';

const plugin: FastifyPluginAsync = async (fastify) => {
  const { taskRunner: runner } = fastify;
  const itemLikeService = new ItemLikeService();
  const taskManager = new TaskManager(itemLikeService);

  fastify.addSchema(common);
  //get ids of liked items
  fastify.get<{ Params: { memberId: string } }>(
    '/:memberId/likes',
    { schema: getLikedItems },
    async ({ member, params: { memberId }, log }) => {
      const task = taskManager.createGetLikedItemsTask(member, memberId);
      return runner.runSingle(task, log);
    },
  );

  // get like count
  fastify.get<{ Params: { itemId: string } }>(
    '/:itemId/like-count',
    { schema: getLikeCount },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createGetLikeCountTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

  // create item like entry
  fastify.post<{ Params: { itemId: string } }>(
    '/:itemId/like',
    { schema: create },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createCreateItemLikeTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

  // delete item like entry
  fastify.delete<{ Params: { entryId: string } }>(
    '/likes/:entryId',
    { schema: deleteOne },
    async ({ member, params: { entryId }, log }) => {
      const task = taskManager.createDeleteItemLikeTask(member, entryId);
      return runner.runSingle(task, log);
    },
  );
};

export default plugin;
