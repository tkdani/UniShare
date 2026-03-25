"use client";
import { createContext, useContext } from "react";

const UserContext = createContext<User | null>(null);

interface UserProviderProps {
  user: User | null;
  children: React.ReactNode;
}

export function UserProvider({ user, children }: UserProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
export function getUser() {
  return useContext(UserContext);
}
