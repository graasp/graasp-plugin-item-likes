// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
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
    this.status = 'RUNNING';

    // get like counts of given item
    const { itemId } = this.input;
    const res = await this.itemLikeService.getLikeCount(itemId, handler);
    this._result = parseInt(res?.count);
    this.status = 'OK';
  }
}
