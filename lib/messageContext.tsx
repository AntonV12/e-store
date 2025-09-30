"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type MessageContextType = {
  message: string | null;
  setMessage: (msg: string | null) => void;
};

const MessageContext = createContext<MessageContextType | null>(null);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const ctx = useContext(MessageContext);
  if (!ctx) throw new Error("useMessage must be used inside MessageProvider");
  return ctx;
}
