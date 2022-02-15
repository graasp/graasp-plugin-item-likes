// global
import { DatabaseTransactionHandler } from 'graasp';
// other services
import { Member } from 'graasp';
// local
import { ItemLikeService } from '../db-service';
import { ItemLike } from '../types';
import { BaseItemLikeTask } from './base-item-like-task';

type InputType = { id: string };

export class DeleteItemLikeTask extends BaseItemLikeTask<ItemLike> {
  input: InputType;

  get name(): string {
    return DeleteItemLikeTask.name;
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

    // delete entry in item-like
    const { id } = this.input;
    this._result = await this.itemLikeService.deleteItemLike(
      id,
      handler,
    );
    this.status = 'OK';
  }
}