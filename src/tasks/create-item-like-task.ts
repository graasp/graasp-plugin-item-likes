import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

// local
import { ItemLikeService } from '../db-service';
import { ItemLike } from '../types';
import { BaseItemLikeTask } from './base-item-like-task';

type InputType = { itemId: string };

export class CreateItemLikeTask extends BaseItemLikeTask<ItemLike> {
  input: InputType;

  get name(): string {
    return CreateItemLikeTask.name;
  }

  constructor(input: InputType, member: Member, itemLikeService: ItemLikeService) {
    super(member, itemLikeService);
    this.input = input ?? {};
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    // create entry in item-like
    const memberId = this.actor.id;
    const { itemId } = this.input;
    this._result = await this.itemLikeService.createItemLike(itemId, memberId, handler);
    this.status = TaskStatus.OK;
  }
}
