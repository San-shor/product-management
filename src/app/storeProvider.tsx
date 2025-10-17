'use client';
import React, { useRef } from 'react';
import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore, store } from './lib/redux/store';

export default function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
