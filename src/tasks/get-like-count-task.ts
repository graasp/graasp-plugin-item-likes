import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemLikeService } from '../db-service';
import { BaseItemLikeTask } from './base-item-like-task';

type InputType = { itemId: string };

export class GetLikeCountTask extends BaseItemLikeTask<number> {
  input: InputType;

  get name(): string {
    return GetLikeCountTask.name;
  }

  constructor(input: InputType, member: Member, itemLikeService: ItemLikeService) {
    super(member, itemLikeService);
    this.input = input ?? {};
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    // get like counts of given item
    const { itemId } = this.input;
    this._result = await this.itemLikeService.getLikeCount(itemId, handler);
    this.status = TaskStatus.OK;
  }
}
