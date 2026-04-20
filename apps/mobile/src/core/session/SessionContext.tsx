import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "sportsapp_seller_uuid";

type SessionContextValue = {
  sellerId: string | null;
  isReady: boolean;
  setSellerId: (value: string | null) => Promise<void>;
  generateDevSellerId: () => Promise<string>;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sellerId, setSellerIdState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setSellerIdState(stored);
      setIsReady(true);
    })();
  }, []);

  const setSellerId = useCallback(async (value: string | null) => {
    if (value) {
      await AsyncStorage.setItem(STORAGE_KEY, value.trim());
      setSellerIdState(value.trim());
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSellerIdState(null);
    }
  }, []);

  const generateDevSellerId = useCallback(async () => {
    const next = Crypto.randomUUID();
    await setSellerId(next);
    return next;
  }, [setSellerId]);

  const value = useMemo(
    () => ({ sellerId, isReady, setSellerId, generateDevSellerId }),
    [sellerId, isReady, setSellerId, generateDevSellerId]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return ctx;
}
