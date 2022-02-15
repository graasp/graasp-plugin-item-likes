// global
import { DatabaseTransactionHandler } from 'graasp';
// other services
import { Member } from 'graasp';
// local
import { ItemLikeService } from '../db-service';
import { LikeCount } from '../types';
import { BaseItemLikeTask } from './base-item-like-task';

type InputType = { itemId: string };

export class GetLikeCountTask extends BaseItemLikeTask<LikeCount> {
  input: InputType;

  get name(): string {
    return GetLikeCountTask.name;
  }

  constructor(
    input: InputType,
    member: Member,
    itemLikeService: ItemLikeService,
  ) {
    super(member, itemLikeService);
    this.input = input ?? {};
  }

  async run(
    handler: DatabaseTransactionHandler,
  ): Promise<void> {
    this.status = 'RUNNING';

    // get like counts of given item
    const { itemId } = this.input;
    this._result = await this.itemLikeService.getLikeCount(
      itemId,
      handler,
    );
    this.status = 'OK';
  }
}