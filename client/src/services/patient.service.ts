import { USE_MOCK } from "@/lib/constants";
import { api } from "./api";
// Validates an optional doctor code. Mock rule (phase 1 only): DR-XXXX format.
export async function verifyDoctorCode(code: string): Promise<boolean> {
  if (USE_MOCK) return /^DR-[A-Z0-9]{4,8}$/i.test(code);
  try { await api(`/doctors/verify/${encodeURIComponent(code)}`); return true; } catch { return false; }
}
