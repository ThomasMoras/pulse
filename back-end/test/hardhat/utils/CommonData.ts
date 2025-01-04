import { Gender } from './Type';

export const user1Data = {
  userAddress: '',
  firstName: 'FirstName1',
  description: 'Descritpion user1',
  email: 'firstname1@gmail.com',
  birthday: 929685600, // 26 years
  gender: Gender.Male,
  interestedBy: [Gender.Female],
  localisation: 'Lyon',
  hobbies: ['Tennis'],
  note: 0,
  ipfsHashs: ['bafkreiawpxy2ai6m26v5prk5jdbf3acfhsxrmrutvmv6ku4hpmbuhp6hbq'],
  issuedAt: Math.floor(Date.now() / 1000), // Timestamp actuel
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const user2Data = {
  userAddress: '',
  firstName: 'FirstName2',
  description: 'Descritpion user2',
  email: 'firstname2@gmail.com',
  birthday: 662688000, // 34 years
  gender: Gender.Female,
  interestedBy: [Gender.Male, Gender.NonBinary],
  localisation: 'Paris',
  hobbies: ['Running', 'Yoga'],
  note: 0,
  ipfsHashs: ['bafybeiht6xwg42yxl25r7wbqkfztowefk7laov2viqyzd4om33oqma2lnq'],
  issuedAt: Math.floor(Date.now() / 1000),
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const user3Data = {
  userAddress: '',
  firstName: 'FirstName3',
  description: 'Descritpion user3',
  email: 'firstname3@gmail.com',
  birthday: 1055916000, // 22 years
  gender: Gender.Male,
  interestedBy: [Gender.Male, Gender.Female],
  localisation: 'Toulouse',
  hobbies: ['Drawing', 'Photography'],
  note: 0,
  ipfsHashs: ['bafybeihfqju4i3i7vyvfaxlzkj2hzsjjt2g5trhlqa2qf6hkypkq6nn5x4'],
  issuedAt: Math.floor(Date.now() / 1000),
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const user4Data = {
  userAddress: '',
  firstName: 'FirstName4',
  description: 'Descritpion user4',
  email: 'firstname4@gmail.com',
  birthday: 397893600, // 42 years
  gender: Gender.Female,
  interestedBy: [Gender.Male],
  localisation: 'Marseille',
  hobbies: ['Reading', 'Sking'],
  note: 0,
  ipfsHashs: ['bafkreidfdjr5abqvjprnfbokr67xs6jj4fwavebssqdp7c6s32es25wzou'],
  issuedAt: Math.floor(Date.now() / 1000),
  issuer: '0x0000000000000000000000000000000000000000',
  isActive: true,
};

export const usersList = [user1Data, user2Data, user3Data, user4Data];
