"use client";

import { useState } from "react";
import { MessageContext } from "@/lib/messageContext";
import Message from "@/components/message/Message";

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string>("");

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
      {message && <Message text={message} onHide={() => setMessage("")} />}
    </MessageContext.Provider>
  );
}
