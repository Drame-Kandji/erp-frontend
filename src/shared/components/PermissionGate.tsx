import type { PropsWithChildren } from "react";
import { can, type Permission } from "../auth/rbac";
import type { UserRole } from "../types/auth";

export function PermissionGate({
  role,
  permission,
  children,
}: PropsWithChildren<{ role: UserRole; permission: Permission }>) {
  return can(role, permission) ? children : null;
}
