import { join } from '@fireflysemantics/join';
import { useApi } from '@src/api';
import { useQuery } from '@tanstack/react-query';

export const usePositions = () => {
  const api = useApi();
  return useQuery(['positions'], () => api.apis.CustomerPositions.get());
};

export const useDepartments = () => {
  const api = useApi();
  return useQuery(['departments'], () => api.apis.Departments.get());
};

export const useRoles = () => {
  const api = useApi();
  return useQuery(['roles'], () => api.apis.Roles.get(), {});
};

export const useOrganizations = () => {
  const api = useApi();
  return useQuery(['organizations'], () => api.apis.Organizations.get());
};

export const useStationChains = () => {
  const api = useApi();
  // return useQuery(['trucks'], () => api.instance.get('/Trucks/with-stats'), { refetchInterval: 300000 });
  return useQuery(['station-chains'], () => api.apis.StationChains.get());
};

export const useStations = () => {
  const api = useApi();
  return useQuery(['stations'], () => api.apis.Stations.get());
};

export const useEfsAccounts = () => {
  const api = useApi();
  return useQuery(['efs-accounts'], () => api.apis.EfsAccounts.get());
};

export const useCompanies = (data?: Record<string, any>) => {
  const api = useApi();
  return useQuery(['companies'], () => api.apis.Companies.get(data));
};

export const useCompanyAccountCards = (data?: Record<string, any>) => {
  const api = useApi();
  return useQuery(['company-account-cards'], () => api.apis.CompanyAccountCards.get(data));
};

export const useCompanyAccounts = (data?: Record<string, any>) => {
  const api = useApi();
  return useQuery(['company-accounts'], () => api.apis.CompanyAccounts.get(data));
};

export const useCompanyBankAccounts = (data?: Record<string, any>) => {
  const api = useApi();
  return useQuery(['company-bank-accounts'], () => api.apis.CompanyBankAccounts.get(data));
};

export const useCompanyBankCards = (data?: Record<string, any>) => {
  const api = useApi();
  return useQuery(['company-bank-cards'], () => api.apis.CompanyBankCards.get(data));
};
