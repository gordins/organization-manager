export type WithId = {
    id: number;
};

export type WithDateCreated = {
    dateCreated: number;
};

export type WithDateUpdated = {
    dateUpdated: number;
};

export type WithMetadata = WithId & WithDateCreated & WithDateUpdated;
