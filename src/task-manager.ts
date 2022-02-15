// global
import { Member } from 'graasp';
// local
import { ItemLikeService } from './db-service';
import { CreateItemLikeTask } from './tasks/create-item-like-task';
import { DeleteItemLikeTask } from './tasks/delete-item-like-task';
import { GetLikeCountTask } from './tasks/get-like-count-task';
import { GetLikedItemsTask } from './tasks/get-liked-items-task';

export class TaskManager {
  private itemLikeService: ItemLikeService;

  constructor(itemLikeService: ItemLikeService) {
    this.itemLikeService = itemLikeService;
  }

  getGetLikedItemsTaskName(): string {
    return GetLikedItemsTask.name;
  }

  getGetLikeCountTaskName(): string {
    return GetLikeCountTask.name;
  }

  getCreateItemLikeTaskName(): string {
    return CreateItemLikeTask.name;
  }

  getDeleteItemLikeTaskName(): string {
    return DeleteItemLikeTask.name;
  }

  createGetLikedItemsTask(member: Member, memberId: string): GetLikedItemsTask {
    return new GetLikedItemsTask(
      { memberId },
      member,
      this.itemLikeService,
    );
  }

  createGetLikeCountTask(member: Member, itemId: string): GetLikeCountTask {
    return new GetLikeCountTask(
      { itemId },
      member,
      this.itemLikeService,
    );
  }

  createCreateItemLikeTask(
    member: Member,
    memberId: string,
    itemId: string,
  ): CreateItemLikeTask {
    return new CreateItemLikeTask(
      { itemId, memberId },
      member,
      this.itemLikeService,
    );
  }

  createDeleteItemLikeTask(
    member: Member,
    entryId: string,
  ): DeleteItemLikeTask {
    return new DeleteItemLikeTask(
      { id: entryId },
      member,
      this.itemLikeService,
    );
  }
}