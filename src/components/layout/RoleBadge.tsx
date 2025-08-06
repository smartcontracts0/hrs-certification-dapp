"use client";

import { UserRole } from "@/hooks/useUserRole";

export default function RoleBadge({ role }: { role: UserRole }) {
  const label = {
    iab: "International Accreditation Body",
    lca: "Local Certification Authority",
    manufacturer: "Manufacturer",
    cab: "Conformity Assessment Body",
    unknown: "Unregistered User"
  }[role];

  const color = {
    iab: "bg-blue-600",
    lca: "bg-red-600",
    manufacturer: "bg-green-600",
    cab: "bg-yellow-600",
    unknown: "bg-gray-500"
  }[role];

  return (
    <span className={`inline-block px-3 py-1 text-white text-sm rounded ${color}`}>
      {label}
    </span>
  );
}
