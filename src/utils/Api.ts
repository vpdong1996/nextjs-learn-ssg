import type { RequestInit } from 'next/dist/server/web/spec-extension/request';
import type { SWRConfiguration, SWRResponse } from 'swr';
import useSWR from 'swr';

export async function getData(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, { ...options });
    const data = response.json();
    return await data;
  } catch (error) {
    return undefined;
  }
}

interface Response<T, E> extends SWRResponse<T, E> {
  isLoading?: boolean;
}

export function useRequest<Type = unknown, Error = unknown>(
  url: string,
  config?: SWRConfiguration<Type>
): Response<Type, Error> {
  const { data, error, mutate, isValidating } = useSWR<Type>(
    url,
    getData,
    config
  );

  return {
    data,
    mutate,
    isValidating,
    error,
    isLoading: !error && !data,
  };
}
