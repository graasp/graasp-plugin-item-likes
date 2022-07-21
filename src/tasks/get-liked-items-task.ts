import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemLikeService } from '../db-service';
import { ItemLike } from '../types';
import { BaseItemLikeTask } from './base-item-like-task';

type InputType = { memberId: string };

export class GetLikedItemsTask extends BaseItemLikeTask<ItemLike[]> {
  input: InputType;

  get name(): string {
    return GetLikedItemsTask.name;
  }

  constructor(input: InputType, member: Member, itemLikeService: ItemLikeService) {
    super(member, itemLikeService);
    this.input = input ?? {};
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    // get all liked items by given user
    const { memberId } = this.input;
    this._result = await this.itemLikeService.getLikedItems(memberId, handler);
    this.status = TaskStatus.OK;
  }
}
