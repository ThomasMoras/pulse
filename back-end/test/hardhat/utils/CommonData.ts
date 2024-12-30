import { Gender } from './Type';

export const user1Data = {
  firstName: 'FirstName1',
  description: 'Descritpion user1',
  email: 'firstname1@gmail.com',
  birthday: 788918400, // 1995-01-01 (correspond à 26 ans)
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
  birthday: 662688000, // 1991-01-01 (correspond à 32 ans)
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
  birthday: 915148800, // 1999-01-01 (correspond à 19 ans)
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
