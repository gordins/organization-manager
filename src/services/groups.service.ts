import { Context } from '../common/context';
import { BadRequestError } from '../common/errors/badRequest.error';
import { CustomErrorType } from '../common/errors/custom.error';
import { Logger } from '../common/logger';
import { WithId } from '../models/common.model';
import { Group, GroupModel } from '../models/group.model';
import { Person } from '../models/person.model';
import { GroupsRepository } from '../repositories/groups.repository';
import { PeopleRepository } from '../repositories/people.repository';

export class GroupsService {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly peopleRepository: PeopleRepository
    ) {}

    public async getAllGroups(ctx: Context): Promise<Group[]> {
        const groups = await this.groupsRepository.getAllGroups(ctx);

        return groups;
    }

    public async getGroupById(ctx: Context, groupId: number): Promise<Group | null> {
        const group = await this.groupsRepository.getGroupById(ctx, groupId);

        if (!group) {
            return null;
        }

        return group;
    }

    public async getGroupMembers(
        ctx: Context,
        groupId: number,
        firstName: string | null,
        jobTitle: string | null
    ): Promise<Person[] | null> {
        const group = await this.groupsRepository.getGroupById(ctx, groupId);

        if (!group) {
            return null;
        }

        const people = await this.peopleRepository.getPeopleInExtendedGroup(ctx, groupId, firstName, jobTitle);

        return people;
    }
    public async createGroup(ctx: Context, newGroup: GroupModel): Promise<WithId | null> {
        try {
            const newGroupId = await this.groupsRepository.createGroup(
                ctx,
                newGroup.name,
                newGroup.parentGroupId ?? null
            );

            return { id: newGroupId };
        } catch (error: any) {
            if (error.type === CustomErrorType.BadRequest) {
                return null;
            }

            throw error;
        }
    }

    public async updateGroup(ctx: Context, groupId: number, newGroup: GroupModel): Promise<WithId | null> {
        try {
            const existingGroup = await this.getGroupById(ctx, groupId);

            await this.validateParentGroup(ctx, groupId, existingGroup, newGroup.parentGroupId);

            const updatedGroupId = await this.groupsRepository.updateGroup(
                ctx,
                groupId,
                newGroup.name,
                newGroup.parentGroupId ?? null
            );

            return { id: updatedGroupId };
        } catch (error: any) {
            Logger.error(ctx, 'Demo Error', error);
            if (error.type === CustomErrorType.BadRequest) {
                return null;
            }

            throw error;
        }
    }

    public async deleteGroups(ctx: Context): Promise<void> {
        await this.groupsRepository.deleteGroups(ctx);
    }

    public async deleteGroup(ctx: Context, groupId: number): Promise<void> {
        await this.groupsRepository.deleteGroup(ctx, groupId);
    }

    private async validateParentGroup(
        ctx: Context,
        groupId: number,
        oldGroup: Group | null,
        newParentGroupId: number | null
    ): Promise<void> {
        Logger.error(ctx, 'DEMO', {
            groupId,
            oldGroup,
            newParentGroupId
        });

        if (oldGroup === null) {
            throw new BadRequestError('The targeted group does not exist');
        }

        const oldParentGroupId = oldGroup.parentGroupId;

        if (oldParentGroupId === newParentGroupId) {
            return;
        }

        if (oldParentGroupId === null) {
            return;
        }

        if (groupId === newParentGroupId) {
            throw new BadRequestError("A group can't be it's own parent");
        }

        const isNewParentDescendantOfGroup = await this.groupsRepository.isDescendantOf(ctx, newParentGroupId, groupId);

        if (isNewParentDescendantOfGroup) {
            throw new BadRequestError("A group can't have a descendant as a parent");
        }
    }
}
