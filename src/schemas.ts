export const getLikedItems = {
  params: { 
    memberId: { $ref: 'http://graasp.org/#/definitions/uuid' },
  },
  response: {
    200: {
      type: 'array',
    },
  },
};

export const create = {
  params: { 
    itemId: { $ref: 'http://graasp.org/#/definitions/uuid' },
    memberId: { $ref: 'http://graasp.org/#/definitions/uuid' },
  }
};

export const deleteOne = {
  params: {
    entryId: { $ref: 'http://graasp.org/#/definitions/uuid' },
  },
};