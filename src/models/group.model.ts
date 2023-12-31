import { WithMetadata } from './common.model';

export type GroupModel = {
    name: string;
    parentGroupId: number | null;
};

export type Group = GroupModel & WithMetadata;
