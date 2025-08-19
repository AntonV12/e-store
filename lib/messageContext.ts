"use client";

import { createContext } from "react";

export interface MessageContextType {
	message: string;
	setMessage: (message: string) => void;
}

export const MessageContext = createContext<MessageContextType>({
	message: "",
	setMessage: () => {},
});
