// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ItemLikeService } from './db-service';
import { create, deleteOne, getLikedItems } from './schemas';
import { TaskManager } from './task-manager';

const plugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner,
  } = fastify;
  const itemLikeService = new ItemLikeService();
  const taskManager = new TaskManager(itemLikeService);

  //get ids of liked items
  fastify.get<{ Params: { memberId: string } }>(
    '/:memberId/likes',
    { schema: getLikedItems },
    async ({ member, params: { memberId }, log }) => {
      const task = taskManager.createGetLikedItemsTask(member, memberId);
      return runner.runSingle(task, log);
    },
  );

  // create item like entry
  fastify.post<{ Params: { itemId: string; memberId: string } }>(
    '/like/:itemId/:memberId',
    { schema: create },
    async ({ member, params: { itemId, memberId }, log }) => {
      const task = taskManager.createCreateItemLikeTask(
        member,
        memberId,
        itemId,
      );
      return runner.runSingle(task, log);
    },
  );

  // delete item like entry
  fastify.delete<{ Params: { entryId: string } }>(
    '/likes/:entryId',
    { schema: deleteOne },
    async ({ member, params: { entryId }, log }) => {
      const task = taskManager.createDeleteItemLikeTask(
        member,
        entryId,
      );
      return runner.runSingle(task, log);
    },
  );
};

export default plugin;