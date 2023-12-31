import { Context } from '../common/context';
import { WithId } from '../models/common.model';
import { Group, GroupModel } from '../models/group.model';
import { WithFirstNameFilter, WithJobTitleFilter } from '../models/person.model';
import { StandardResponse } from '../models/standardResponse.model';
import { GroupsService } from '../services/groups.service';
import { OrganizationService } from '../services/organization.service';

export class GroupsController {
    constructor(
        private readonly groupsService: GroupsService,
        private readonly organizationService: OrganizationService
    ) {}

    public getGroups = async (
        ctx: Context,
        _params: GetGroupsRequestParams,
        _body: GetGroupsRequestBody
    ): Promise<StandardResponse<GetGroupsResponseBody>> => {
        const groups = await this.groupsService.getAllGroups(ctx);

        return {
            status: 200,
            data: groups
        };
    };

    public getGroup = async (
        ctx: Context,
        params: GetGroupRequestParams,
        _body: GetGroupRequestBody
    ): Promise<StandardResponse<GetGroupResponseBody>> => {
        const group = await this.groupsService.getGroupById(ctx, params.id);

        if (!group) {
            return {
                status: 404,
                message: `Group not found for id ${params.id}`
            };
        }

        return {
            status: 200,
            data: group
        };
    };

    public getGroupMembers = async (
        ctx: Context,
        params: GetGroupMembersRequestParams,
        _body: GetGroupMembersRequestBody
    ): Promise<StandardResponse<GetGroupMembersResponseBody>> => {
        const groupMembers = await this.groupsService.getGroupMembers(
            ctx,
            params.id,
            params.firstName ?? null,
            params.jobTitle ?? null
        );

        if (groupMembers === null) {
            return {
                status: 404,
                message: `Group not found for id ${params.id}`
            };
        }

        return {
            status: 200,
            data: groupMembers
        };
    };

    public createGroup = async (
        ctx: Context,
        _params: CreateGroupRequestParams,
        body: CreateGroupRequestBody
    ): Promise<StandardResponse<CreateGroupResponseBody>> => {
        const newGroupId = await this.groupsService.createGroup(ctx, body);

        if (newGroupId === null) {
            return {
                status: 409,
                message: 'Creating failed: a group with this name already exists'
            };
        }

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 201,
            data: newGroupId
        };
    };

    public updateGroup = async (
        ctx: Context,
        params: UpdateGroupRequestParams,
        body: UpdateGroupRequestBody
    ): Promise<StandardResponse<UpdateGroupResponseBody>> => {
        const updatedGroupId = await this.groupsService.updateGroup(ctx, params.id, body);
        if (updatedGroupId === null) {
            return {
                status: 409,
                message: "Updating failed: group name is unique. A group can't be it's own parent"
            };
        }

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 204,
            message: 'Resource updated succesfully'
        };
    };

    public deleteGroups = async (
        ctx: Context,
        _params: DeleteGroupsRequestParams,
        _body: DeleteGroupsRequestBody
    ): Promise<StandardResponse<DeleteGroupsResponseBody>> => {
        await this.groupsService.deleteGroups(ctx);

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 204,
            message: 'All resources deleted succesfully'
        };
    };

    public deleteGroup = async (
        ctx: Context,
        params: DeleteGroupRequestParams,
        _body: DeleteGroupRequestBody
    ): Promise<StandardResponse<DeleteGroupResponseBody>> => {
        await this.groupsService.deleteGroup(ctx, params.id);

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 204,
            message: 'Resource deleted succesfully'
        };
    };
}

export type GetGroupsRequestParams = object;
export type GetGroupsRequestBody = object;
export type GetGroupsResponseBody = Group[];

export type GetGroupRequestParams = WithId;
export type GetGroupRequestBody = object;
export type GetGroupResponseBody = Group;

export type GetGroupMembersRequestParams = object & WithId & WithFirstNameFilter & WithJobTitleFilter;
export type GetGroupMembersRequestBody = object;
export type GetGroupMembersResponseBody = object;

export type CreateGroupRequestParams = object;
export type CreateGroupRequestBody = GroupModel;
export type CreateGroupResponseBody = object & WithId;

export type UpdateGroupRequestParams = object & WithId;
export type UpdateGroupRequestBody = GroupModel;
export type UpdateGroupResponseBody = GroupModel;

export type DeleteGroupsRequestParams = object;
export type DeleteGroupsRequestBody = object;
export type DeleteGroupsResponseBody = object;

export type DeleteGroupRequestParams = object & WithId;
export type DeleteGroupRequestBody = object;
export type DeleteGroupResponseBody = object;
