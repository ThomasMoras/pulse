export enum Gender {
    Male,
    Female,
    NonBinary,
    Other,
    Undisclosed,
}

export interface SBTMetaData {
    firstName: string;
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
}
