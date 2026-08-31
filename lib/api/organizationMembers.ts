// lib/api/organizationMembers.ts

import { apiFetch } from "@/lib/api/client";
import type { OrganizationMemberListResponse } from "@/types/user";

export const getOrganizationMembers =
  async (): Promise<OrganizationMemberListResponse> => {
    return apiFetch<OrganizationMemberListResponse>(
      "/api/organization-members",
    );
  };
