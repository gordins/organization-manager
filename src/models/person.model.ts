import { WithMetadata } from './common.model';

export type PersonModel = {
    firstName: string;
    lastName: string;
    jobTitle: string;
    groupId: number | null;
};

export type Person = PersonModel & WithMetadata;

export type WithFirstNameFilter = {
    firstName?: string;
};

export type WithJobTitleFilter = {
    jobTitle?: string;
};
