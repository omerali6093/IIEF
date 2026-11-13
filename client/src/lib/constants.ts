export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
export const REQUIRE_CONTACT = false; // set true if the client requires a contact number
export const STORAGE = { patient: "iief.patient", answers: "iief.answers", result: "iief.result" } as const;
