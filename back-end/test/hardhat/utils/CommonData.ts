import { Gender } from './Type';

export const user1Data = {
  firstName: 'FirstName1',
  description: 'Descritpion user1',
  email: 'firstname1@gmail.com',
  birthday: 929685600, // 26 years
  gender: Gender.Male,
  interestedBy: [Gender.Female],
  localisation: 'Lyon',
  hobbies: ['Tennis'],
  note: 0,
  ipfsHashs: [],
  issuedAt: Math.floor(Date.now() / 1000), // Timestamp actuel
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const user2Data = {
  firstName: 'FirstName2',
  description: 'Descritpion user2',
  email: 'firstname2@gmail.com',
  birthday: 662688000, // 34 years
  gender: Gender.Female,
  interestedBy: [Gender.Male, Gender.NonBinary],
  localisation: 'Paris',
  hobbies: ['Running', 'Yoga'],
  note: 0,
  ipfsHashs: [],
  issuedAt: Math.floor(Date.now() / 1000),
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const user3Data = {
  firstName: 'FirstName3',
  description: 'Descritpion user3',
  email: 'firstname3@gmail.com',
  birthday: 1055916000, // 22 years
  gender: Gender.Undisclosed,
  interestedBy: [Gender.Male, Gender.Female],
  localisation: 'Toulouse',
  hobbies: ['Drawing', 'Photography'],
  note: 0,
  ipfsHashs: [],
  issuedAt: Math.floor(Date.now() / 1000),
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const user4Data = {
  firstName: 'FirstName4',
  description: 'Descritpion user4',
  email: 'firstname4@gmail.com',
  birthday: 397893600, // 42 years
  gender: Gender.Female,
  interestedBy: [Gender.Male],
  localisation: 'Marseille',
  hobbies: ['Reading', 'Sking'],
  note: 0,
  ipfsHashs: [],
  issuedAt: Math.floor(Date.now() / 1000),
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};
