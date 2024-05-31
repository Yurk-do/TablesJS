import { apiService } from '../apiService';

export const getChapters = (): Promise<any> =>
  apiService.get('/chapters/2').then((respone) => respone.data.data);

export const updateTableData = (data: any): Promise<any> =>
  apiService.patch('/tableData/1', { data }).then((response) => response.data);

export const updateChapters = (data: any): Promise<any> =>
  apiService.patch('/chapters/2', { data }).then((response) => response.data);
