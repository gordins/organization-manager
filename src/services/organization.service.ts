import { CacheConnection } from '../common/connections/cache.connection';
import { Context } from '../common/context';
import { Logger } from '../common/logger';
import { Organization } from '../models/organization.model';
import { GroupsRepository } from '../repositories/groups.repository';
import { PeopleRepository } from '../repositories/people.repository';

const ORGANIZATION_KEY = 'ORG';

export class OrganizationService {
    constructor(
        private readonly groupsRepository: GroupsRepository,
        private readonly peopleRepository: PeopleRepository,
        private readonly cacheConnection: CacheConnection
    ) {}

    public async clearCache(ctx: Context): Promise<void> {
        await this.cacheConnection.invalidate(ORGANIZATION_KEY);
        Logger.info(ctx, 'Cache manually cleared');
    }

    public async updateOrganization(ctx: Context): Promise<Organization> {
        Logger.info(ctx, 'Cache update for organization');

        const organization = await this.buildOrganization(ctx);

        await this.cacheConnection.set(ORGANIZATION_KEY, JSON.stringify(organization));

        return organization;
    }

    public async getOrganization(ctx: Context): Promise<Organization> {
        const cachedOrganization = await this.cacheConnection.get(ORGANIZATION_KEY);

        if (!cachedOrganization) {
            Logger.warn(ctx, 'Cache miss for GET organization');

            const organization = await this.updateOrganization(ctx);

            return organization;
        } else {
            Logger.info(ctx, 'Cache hit for GET organization');
        }

        return JSON.parse(cachedOrganization);
    }

    private async buildOrganization(ctx: Context): Promise<Organization> {
        const groups = await this.groupsRepository.getAllGroups(ctx);
        const people = await this.peopleRepository.getAllPeople(ctx);

        const organization: any = {};

        const groupsById: { [key: number]: any } = {};

        for (const group of groups) {
            groupsById[group.id] = { ...group, members: [] };
        }

        for (const group of groups) {
            const groupById = groupsById[group.id];
            if (group.parentGroupId) {
                groupsById[group.parentGroupId].members.push(groupById);
            } else {
                organization[group.name] = groupById;
            }
        }

        for (const person of people) {
            const personName = `${person.firstName} ${person.lastName}`;
            if (person.groupId) {
                groupsById[person.groupId].members.push(person);
            } else {
                organization[personName] = person.jobTitle;
            }
        }

        for (const key of Object.keys(organization)) {
            if (organization[key].name) {
                organization[key] = this.convertGroup(organization[key]);
            }
        }

        return organization;
    }

    private convertGroup(group: any): any {
        const result: any = {};
        for (const member of group.members) {
            if (member.name) {
                result[member.name] = this.convertGroup(member);
            } else {
                result[`${member.firstName} ${member.lastName}`] = member.jobTitle;
            }
        }

        return result;
    }
}
