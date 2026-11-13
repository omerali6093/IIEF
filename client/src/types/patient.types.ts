export type PatientDetails = {
  fullName: string;
  age: number;
  ageGroup?: string;
  bloodPressure?: string;
  weightRange?: string;
  contactNumber?: string;
  doctorCode?: string;
  consent: true;
};
