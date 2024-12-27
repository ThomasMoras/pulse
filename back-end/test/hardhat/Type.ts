export enum Gender {
  Male,
  Female,
  NonBinary,
  Other,
  Undisclosed,
}

export enum InteractionStatus {
  NONE,
  LIKED,
  DISLIKED,
  SUPER_LIKED,
}

export interface SBTMetaData {
  firstName: string;
  description: string;
  email: string;
  birthday: number;
  gender: Gender;
  interestedBy: Gender[];
  localisation: string;
  hobbies: string[];
  note: number;
  ipfsHashs: string[];
  issuedAt: number;
  issuer: string;
  isActive: boolean;
}
