import { AxiosError } from 'axios';
import { getIndexedDbData } from '../../db/actions';
import { Articles, Stores } from '../../db/db';

type ErrorHandlerType = (error: AxiosError) => Promise<any>;

// type ConfigDto = AxiosRequestConfig;

// const noInternet = (): Promise<Error> => {
//   throw new Error('No internet connection');
// };

const switchToLocalDB: ErrorHandlerType = (error) => {
  const { config } = error;
  // const originalRequest: ConfigDto = config;

  const article = config?.url?.includes(Articles.Chapters)
    ? Articles.Chapters
    : Articles.TableData;

  // return new Promise((resolve) => {
  //   originalRequest.url = '/initialData'
  //   resolve(axios(originalRequest))
  // })
  // @ts-ignore
  return getIndexedDbData(Stores.Tables, article).then((response) => ({
    data: response?.[0],
  }));
};

const errorConfig: { [id: number]: ErrorHandlerType } = {
  0: switchToLocalDB,
  404: switchToLocalDB,
};

export const apiErrorHandler = async (error: AxiosError): Promise<any> => {
  const { request, response } = error;
  const statusCode: number = response?.status || request?.status;

  const handler = errorConfig[statusCode];

  return handler?.(error) || Promise.reject(error);
};
