import { Context } from '../common/context';
import { WithId } from '../models/common.model';
import { Group } from '../models/group.model';
import { Person, PersonModel } from '../models/person.model';
import { GroupsRepository } from '../repositories/groups.repository';
import { PeopleRepository } from '../repositories/people.repository';

export class PeopleService {
    constructor(
        private readonly peopleRepository: PeopleRepository,
        private readonly groupsRepository: GroupsRepository
    ) {}

    public async getAllPeople(ctx: Context): Promise<Person[]> {
        const people = await this.peopleRepository.getAllPeople(ctx);

        return people;
    }

    public async getPersonById(ctx: Context, personId: number): Promise<Person | null> {
        const person = await this.peopleRepository.getPersonById(ctx, personId);

        if (!person) {
            return null;
        }

        return person;
    }

    public async getPersonMemberships(ctx: Context, personId: number): Promise<Group[] | null> {
        const person = await this.peopleRepository.getPersonById(ctx, personId);

        if (!person) {
            return null;
        }
        if (!person.groupId) {
            return [];
        }

        const groupBranch = await this.groupsRepository.getGroupBranch(ctx, personId);

        return groupBranch;
    }

    public async getPeopleByGroupId(ctx: Context, groupId: number | null): Promise<Person[]> {
        const people = await this.peopleRepository.getPeopleByGroupId(ctx, groupId);

        return people;
    }

    public async createPerson(ctx: Context, newPerson: PersonModel): Promise<WithId | null> {
        const newPersonId = await this.peopleRepository.createPerson(
            ctx,
            newPerson.firstName,
            newPerson.lastName,
            newPerson.jobTitle,
            newPerson.groupId ?? null
        );

        if (newPerson.groupId) {
            await this.groupsRepository.blindUpdate(ctx, newPerson.groupId);
        }
        return { id: newPersonId };
    }

    public async updatePerson(ctx: Context, personId: number, newPerson: PersonModel): Promise<WithId | null> {
        const existingPerson = await this.peopleRepository.getPersonById(ctx, personId);

        if (existingPerson === null) {
            return null;
        }

        const updatePersonId = await this.peopleRepository.updatePerson(
            ctx,
            personId,
            newPerson.firstName,
            newPerson.lastName,
            newPerson.jobTitle,
            newPerson.groupId ?? null
        );

        if (existingPerson.groupId !== newPerson.groupId) {
            if (newPerson.groupId) {
                await this.groupsRepository.blindUpdate(ctx, newPerson.groupId);
            }

            if (existingPerson.groupId) {
                await this.groupsRepository.blindUpdate(ctx, existingPerson.groupId);
            }
        }

        return { id: updatePersonId };
    }

    public async deletePeople(ctx: Context): Promise<void> {
        await this.peopleRepository.deletePeople(ctx);
    }

    public async deletePerson(ctx: Context, personId: number): Promise<void> {
        await this.peopleRepository.deletePerson(ctx, personId);
    }
}
