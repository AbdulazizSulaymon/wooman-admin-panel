const readyModels = {
  User: {},
  Role: {},
  Permission: {},
  Posts: {},
  Tag: {},
  Comment: {},
  Order: {},
  OrderGroup: {},
  Category: {},
  Product: {},
};

export type Models = Record<string, Record<string, unknown> & { name: string }>;

export type ModelsNames = keyof typeof readyModels;

export const models: Models = Object.keys(readyModels).reduce(
  (previousValue, currentValue, currentIndex) => ({
    ...previousValue,
    [currentValue]: {
      ...((readyModels as Record<string, unknown>)[currentValue] as Object),
      name: currentValue,
    },
  }),
  {},
);
