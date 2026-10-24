"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role, DemoUser } from "@/types";

export const DEMO_USERS: Record<Role, DemoUser> = {
  BRAND_MANAGER: {
    id: "user_bm_1",
    name: "Priya Sharma",
    email: "priya@ecosip.co",
    role: "BRAND_MANAGER",
    title: "Brand Governance Lead",
    description: "Sets Campaign Contracts, truth boundaries, and audience variants.",
  },
  CREATOR: {
    id: "user_cr_1",
    name: "Alex Chen",
    email: "alex.creator@ecosip.co",
    role: "CREATOR",
    title: "Senior Copy & Visual Creator",
    description: "Uploads campaign packs and rectifies preflight consistency issues.",
  },
  REVIEWER: {
    id: "user_rev_1",
    name: "Marcus Vance",
    email: "marcus.legal@ecosip.co",
    role: "REVIEWER",
    title: "Authorised Gatekeeper",
    description: "Executes cryptographic revision locks and approves final publish packs.",
  },
};

interface RoleContextType {
  currentRole: Role;
  currentUser: DemoUser;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType>({
  currentRole: "BRAND_MANAGER",
  currentUser: DEMO_USERS.BRAND_MANAGER,
  setRole: () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>("BRAND_MANAGER");

  useEffect(() => {
    const saved = localStorage.getItem("cg_demo_role") as Role;
    if (saved && DEMO_USERS[saved]) {
      setCurrentRole(saved);
    }
  }, []);

  const setRole = (role: Role) => {
    setCurrentRole(role);
    localStorage.setItem("cg_demo_role", role);
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser: DEMO_USERS[currentRole],
        setRole,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}