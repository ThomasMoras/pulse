export enum Gender {
  Male = 1,
  Female = 2,
  NonBinary = 3,
  Other = 4,
  Undisclosed = 5,
}

export interface SBTMetaData {
  id: number;
  firstName: string;
  email: string;
  age: number;
  gender: Gender;
  interestedBy: Gender[];
  localisation: string;
  hobbies: string[];
  note: number;
  ipfsHashs: string[];
  issuedAt: number;
  issuer: string;
}
