const readyModels = {
  Users: {},
  Roles: {},
  Permissions: {},
  Departments: {},
  EfsAccounts: {},
  Organizations: {},
  StationChains: {},
  WeatherForecast: {},
  CustomerPositions: {},
  Stations: {},
  Companies: {},
  CompanyAccountCards: {},
  CompanyAccounts: {},
  CompanyBankAccounts: {},
  CompanyBankCards: {},
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
