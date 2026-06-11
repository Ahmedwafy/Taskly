// src/redux/providers.ts

'use client';

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './reduxStore';

interface ReduxProviderProps {
  children: ReactNode;
}

// Link Between Redux & Project ... Using Provider
export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
