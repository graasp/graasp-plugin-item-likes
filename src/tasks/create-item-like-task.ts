// global
import { DatabaseTransactionHandler } from 'graasp';
// other services
import { Member } from 'graasp';
// local
import { ItemLikeService } from '../db-service';
import { BaseItemLikeTask } from './base-item-like-task';

type InputType = { itemId: string; memberId: string };

export class CreateItemLikeTask extends BaseItemLikeTask<string> {
  input: InputType;

  get name(): string {
    return CreateItemLikeTask.name;
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

    // create entry in item-category
    const { itemId, memberId } = this.input;
    this._result = await this.itemLikeService.createItemLike(
      itemId,
      memberId,
      handler,
    );
    this.status = 'OK';
  }
}