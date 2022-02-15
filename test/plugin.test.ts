import {
  TaskRunner,
} from 'graasp-test';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';
import plugin from '../src/plugin';
import build from './app';
import { buildItem, buildMember, ITEM_LIKES } from './constants';
const runner = new TaskRunner();

describe('Item Like', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  console.log('aaa');

  describe('GET /:memberId/likes', () => {
    it('Get item likes of a user', async () => {
      const app = await build({
        runner,
        plugin,
      });
      const currentMember = buildMember();
      const result = ITEM_LIKES.filter((entry) => entry.memberId === currentMember.id);
      jest
        .spyOn(runner, 'runSingle')
        .mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: `/${currentMember.id}/likes`,
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
      });

      jest
        .spyOn(runner, 'runSingle')
        .mockImplementation(async () => true);

      const res = await app.inject({
        method: 'GET',
        url: '/invalid-id/likes',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('GET /:itemId/like-count', () => {
    it('Get like count', async () => {
      const app = await build({
        plugin,
        runner,
      });

      const item = buildItem();
      const result = ITEM_LIKES.filter((entry) => entry.itemId === item.id).length;
      jest
        .spyOn(runner, 'runSingle')
        .mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: `/${item.id}/like-count`,
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
      });

      jest
        .spyOn(runner, 'runSingle')
        .mockImplementation(async () => true);

      const res = await app.inject({
        method: 'GET',
        url: '/invalid-id/like-count',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /:itemId/like', () => {
    it('Create like record', async () => {
      const app = await build({
        plugin,
        runner,
      });

      const itemLike = ITEM_LIKES[0];
      jest
        .spyOn(runner, 'runSingle')
        .mockImplementation(async () => itemLike);

      const res = await app.inject({
        method: 'POST',
        url: `/${v4()}/like`,
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(itemLike);
    });
    it('Bad request if id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
      });

      const res = await app.inject({
        method: 'POST',
        url: '/invalid-id/like',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
  describe('DELETE /likes/:entryId', () => {
    it('Delete item like', async () => {
      const app = await build({
        plugin,
        runner,
      });
      const result = ITEM_LIKES[0];
      jest
        .spyOn(runner, 'runSingle')
        .mockImplementation(async () => result);

      const res = await app.inject({
        method: 'DELETE',
        url: `/likes/${v4()}`,
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if item id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
      });
      const res = await app.inject({
        method: 'DELETE',
        url: '/likes/invalid-id',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
