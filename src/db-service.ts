// global
import { Item } from 'graasp';
import { sql, DatabaseTransactionConnection as TrxHandler } from 'slonik';
// local
import { ItemLike } from './types';

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
  async getLikedItems(
    memberId: string,
    dbHandler: TrxHandler,
  ): Promise<ItemLike[]> {
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
   * Get Items liked by users most
   */
   async getMostLikedItems(
    dbHandler: TrxHandler,
  ): Promise<Item[]> {
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

  async createItemLike(
    itemId: string,
    memberId: string,
    transactionHandler: TrxHandler,
  ): Promise<string> {
    return transactionHandler
      .query<string>(
        sql`
        INSERT INTO item_like (item_id, member_id)
        VALUES (${itemId}, ${memberId})
        ON CONFLICT DO NOTHING
      `,
      ).then(({ rows }) => rows[0]);
  }

  async deleteItemLike(id: string, transactionHandler: TrxHandler): Promise<string> {
    return transactionHandler
      .query<string>(
        sql`
        DELETE FROM item_like
        WHERE id = ${id}
      `,
      ).then(({ rows }) => rows[0]);
  }
}