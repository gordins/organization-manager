import { Context } from '../common/context';
import { WithId } from '../models/common.model';
import { Group } from '../models/group.model';
import { Person, PersonModel } from '../models/person.model';
import { StandardResponse } from '../models/standardResponse.model';
import { OrganizationService } from '../services/organization.service';
import { PeopleService } from '../services/people.service';

export class PeopleController {
    constructor(
        private readonly peopleService: PeopleService,
        private readonly organizationService: OrganizationService
    ) {}

    public getPeople = async (
        ctx: Context,
        _params: GetPeopleRequestParams,
        _body: GetPeopleRequestBody
    ): Promise<StandardResponse<GetPeopleResponseBody>> => {
        const people = await this.peopleService.getAllPeople(ctx);

        return {
            status: 200,
            data: people
        };
    };

    public getPerson = async (
        ctx: Context,
        params: GetPersonRequestParams,
        _body: GetPersonRequestBody
    ): Promise<StandardResponse<GetPersonResponseBody>> => {
        const person = await this.peopleService.getPersonById(ctx, params.id);

        if (!person) {
            return {
                status: 404,
                message: `Person not found for id ${params.id}`
            };
        }

        return {
            status: 200,
            data: person
        };
    };

    public getPersonMemberships = async (
        ctx: Context,
        params: GetPersonMembershipsRequestParams,
        _body: GetPersonMembershipsRequestBody
    ): Promise<StandardResponse<GetPersonMembershipsResponseBody>> => {
        const memberships = await this.peopleService.getPersonMemberships(ctx, params.id);
        if (!memberships) {
            return {
                status: 404,
                message: `Person not found for id ${params.id}`
            };
        }
        return {
            status: 200,
            data: memberships
        };
    };

    public createPerson = async (
        ctx: Context,
        _params: CreatePersonRequestParams,
        body: CreatePersonRequestBody
    ): Promise<StandardResponse<CreatePersonResponseBody>> => {
        const newPersonId = await this.peopleService.createPerson(ctx, body);

        if (newPersonId === null) {
            return {
                status: 409,
                message: 'Creating failed: a person with this name already exists'
            };
        }

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 201,
            data: newPersonId
        };
    };

    public updatePerson = async (
        ctx: Context,
        params: UpdatePersonRequestParams,
        body: UpdatePersonRequestBody
    ): Promise<StandardResponse<UpdatePersonResponseBody>> => {
        const updatedPersonId = await this.peopleService.updatePerson(ctx, params.id, body);
        if (updatedPersonId === null) {
            return {
                status: 409,
                message: 'Updating failed: a person with this name already exists'
            };
        }

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 204,
            message: 'Resource updated succesfully'
        };
    };

    public deletePeople = async (
        ctx: Context,
        _params: DeletePersonRequestParams,
        _body: DeletePeopleRequestBody
    ): Promise<StandardResponse<DeletePeopleResponseBody>> => {
        await this.peopleService.deletePeople(ctx);

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 204,
            message: 'All resources deleted succesfully'
        };
    };

    public deletePerson = async (
        ctx: Context,
        params: DeletePersonRequestParams,
        _body: DeletePersonRequestBody
    ): Promise<StandardResponse<DeletePersonResponseBody>> => {
        await this.peopleService.deletePerson(ctx, params.id);

        await this.organizationService.updateOrganization(ctx);

        return {
            status: 204,
            message: 'Resource deleted succesfully'
        };
    };
}

export type GetPeopleRequestParams = object;
export type GetPeopleRequestBody = object;
export type GetPeopleResponseBody = Person[];

export type GetPersonRequestParams = WithId;
export type GetPersonRequestBody = object;
export type GetPersonResponseBody = Person;

export type CreatePersonRequestParams = object;
export type CreatePersonRequestBody = PersonModel;
export type CreatePersonResponseBody = object & WithId;

export type UpdatePersonRequestParams = object & WithId;
export type UpdatePersonRequestBody = PersonModel;
export type UpdatePersonResponseBody = PersonModel;

export type DeletePeopleRequestParams = object;
export type DeletePeopleRequestBody = object;
export type DeletePeopleResponseBody = object;

export type DeletePersonRequestParams = object & WithId;
export type DeletePersonRequestBody = object;
export type DeletePersonResponseBody = object;

export type GetPersonMembershipsRequestParams = object & WithId;
export type GetPersonMembershipsRequestBody = object;
export type GetPersonMembershipsResponseBody = object & Group[];
