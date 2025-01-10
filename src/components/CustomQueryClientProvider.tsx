'use client';
import { FC, PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const customQueryClientProvider = new QueryClient();

const CustomQueryClientProvider: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={customQueryClientProvider}>
    {children}
  </QueryClientProvider>
);

export default CustomQueryClientProvider;
