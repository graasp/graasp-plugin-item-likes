import { FastifyLoggerInstance } from 'fastify';

import {
  Actor,
  DatabaseTransactionHandler,
  IndividualResultType,
  PostHookHandlerType,
  PreHookHandlerType,
  Task,
  TaskStatus,
} from '@graasp/sdk';

import { ItemLikeService } from '../db-service';

export abstract class BaseItemLikeTask<R> implements Task<Actor, R> {
  protected itemLikeService: ItemLikeService;
  protected _result!: R;
  protected _message!: string;

  readonly actor: Actor;

  status: TaskStatus;
  targetId!: string;
  data!: Partial<IndividualResultType<R>>;
  preHookHandler!: PreHookHandlerType<R>;
  postHookHandler!: PostHookHandlerType<R>;

  constructor(actor: Actor, itemLikeService: ItemLikeService) {
    this.actor = actor;
    this.itemLikeService = itemLikeService;
    this.status = TaskStatus.NEW;
  }

  abstract get name(): string;
  get result(): R {
    return this._result;
  }
  get message(): string {
    return this._message;
  }

  abstract run(
    handler: DatabaseTransactionHandler,
    log?: FastifyLoggerInstance,
  ): Promise<void | BaseItemLikeTask<R>[]>;
}
