# Phase 1 status
Done: home, patient details, one-question-at-a-time assessment, result page, English/Urdu with RTL, responsive UI.
Mock mode (`NEXT_PUBLIC_USE_MOCK=true`): questionnaire text is PLACEHOLDER, the result is a fixed DEMO value (never computed in the browser),
doctor codes validate with a mock `DR-XXXX` pattern, PDF/WhatsApp need the backend.
Needs from the client/clinician: approved IIEF-5 wording + answer options, authorized Urdu translation, scoring version, interpretation labels.
Not built (per PRD): doctor/admin dashboards, backend, QR referral (`?ref=` token) handling.
