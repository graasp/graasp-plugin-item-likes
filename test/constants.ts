import { v4 } from 'uuid';

import { Item, ItemMembership, Member } from '@graasp/sdk';

export const buildMember = (): Partial<Member> => ({
  id: v4(),
  name: 'member',
  email: 'member@email.com',
  extra: {},
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export const buildItemMembership = (): Partial<ItemMembership> => ({
  id: v4(),
  memberId: buildMember().id,
  itemPath: v4().replace(/-/g, '_'),
  creator: v4(),
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export const buildItem = (): Item => {
  const id = v4();
  return {
    id,
    path: id.replace(/-/g, '_'),
    name: id,
    description: 'description',
    type: 'folder',
    extra: {},
    creator: v4(),
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    settings: {
      isPinned: false,
      showChatBox: false,
    },
  };
};

export const ITEM_LIKES = [
  {
    id: v4(),
    itemId: buildItem().id,
    memberId: buildMember().id,
    createdAt: 'timestamp',
  },
  {
    id: v4(),
    itemId: buildItem().id,
    memberId: buildMember().id,
    createdAt: 'timestamp2',
  },
];

export const LIKE_COUNT = 0;
