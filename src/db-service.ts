import { DatabaseTransactionConnection as TrxHandler, sql } from 'slonik';

import { Item } from '@graasp/sdk';

import { ItemLike, LikeCount } from './types';

/**
 * Database's first layer of abstraction for Categorys
 */
export class ItemLikeService {
  private static allColumns = sql.join(
    ['id', ['item_id', 'itemId'], ['member_id', 'memberId'], ['created_at', 'createdAt']].map((c) =>
      !Array.isArray(c)
        ? sql.identifier([c])
        : sql.join(
            c.map((cwa) => sql.identifier([cwa])),
            sql` AS `,
          ),
    ),
    sql`, `,
  );

  /**
   * Get ItemIds liked by given memberId.
   * @param memberId user's id
   * @param dbHandler Database handler
   */
  async getLikedItems(memberId: string, dbHandler: TrxHandler): Promise<ItemLike[]> {
    return dbHandler
      .query<ItemLike>(
        sql`
        SELECT ${ItemLikeService.allColumns}
        FROM item_like
        WHERE member_id = ${memberId}
        `,
      )
      .then(({ rows }) => rows.slice(0));
  }

  /**
   * Get most liked items by all users
   */
  async getMostLikedItems(dbHandler: TrxHandler): Promise<Item[]> {
    return dbHandler
      .query<Item>(
        sql`
        SELECT item_id
        FROM item_like
        GROUP BY item_id
        ORDER BY count(*)
        LIMIT 20
        `,
      )
      .then(({ rows }) => rows.slice(0));
  }

  /**
   * Get like count of given item
   */
  async getLikeCount(itemId: string, dbHandler: TrxHandler): Promise<number> {
    return dbHandler
      .query<LikeCount>(
        sql`
        SELECT count(*)
        FROM item_like
        WHERE item_id = ${itemId}
        `,
      )
      .then(({ rows }) => parseInt(rows[0]?.count));
  }

  /**
   * create a record
   * @param memberId user's id
   * @param itemId item's id
   */
  async createItemLike(
    itemId: string,
    memberId: string,
    transactionHandler: TrxHandler,
  ): Promise<ItemLike> {
    return transactionHandler
      .query<ItemLike>(
        sql`
        INSERT INTO item_like (item_id, member_id)
        VALUES (${itemId}, ${memberId})
        ON CONFLICT DO NOTHING
        RETURNING *
      `,
      )
      .then(({ rows }) => rows[0]);
  }

  /**
   * delete a record
   * @param id entry's id
   */
  async deleteItemLike(id: string, transactionHandler: TrxHandler): Promise<ItemLike> {
    return transactionHandler
      .query<ItemLike>(
        sql`
        DELETE FROM item_like
        WHERE id = ${id}
        RETURNING *
      `,
      )
      .then(({ rows }) => rows[0]);
  }
}
