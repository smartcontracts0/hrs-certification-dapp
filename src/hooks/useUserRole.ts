import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { registrationABI, registrationAddress } from "@/lib/contracts/registration";
import { certificationABI, certificationAddress } from "@/lib/contracts/certification";

export type UserRole = "manufacturer" | "cab" | "iab" | "lca" | "unknown";

export function useUserRole(account: string | null, provider: ethers.BrowserProvider | null): UserRole {
  const [role, setRole] = useState<UserRole>("unknown");

  useEffect(() => {
    async function detectRole() {
      if (!account || !provider) return;

      try {
        const regContract = new ethers.Contract(registrationAddress, registrationABI, provider);
        const certContract = new ethers.Contract(certificationAddress, certificationABI, provider);

        const [isManufacturer, isCAB, regOwner, certOwner] = await Promise.all([
          regContract.registeredManufacturers(account),
          regContract.registeredCABs(account),
          regContract.owner(),
          certContract.owner()
        ]);

        if (regOwner.toLowerCase() === account.toLowerCase()) {
          setRole("iab");
        } else if (certOwner.toLowerCase() === account.toLowerCase()) {
          setRole("lca");
        } else if (isManufacturer) {
          setRole("manufacturer");
        } else if (isCAB) {
          setRole("cab");
        } else {
          setRole("unknown");
        }
      } catch (err) {
        console.error("Failed to detect role:", err);
        setRole("unknown");
      }
    }

    detectRole();
  }, [account, provider]);

  return role;
}
