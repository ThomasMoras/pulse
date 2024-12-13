export enum Gender {
    Male,
    Female,
    NonBinary,
    Other,
    Undisclosed,
}

export const user1Data = {
    firstName: "FirstName1",
    lastName: "LastName1",
    age: 26,
    gender: Gender.Male,
    localisation: "Lyon",
    hobbies: "Tennis",
};

export const user2Data = {
    firstName: "FirstName2",
    lastName: "LastName2",
    age: 32,
    gender: Gender.Female,
    localisation: "Paris",
    hobbies: "Running",
};

export const user3Data = {
    firstName: "FirstName3",
    lastName: "LastName3",
    age: 19,
    gender: Gender.Undisclosed,
    localisation: "Toulouse",
    hobbies: "Drawing",
};
