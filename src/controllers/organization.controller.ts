import { Context } from '../common/context';
import { StandardResponse } from '../models/standardResponse.model';
import { OrganizationService } from '../services/organization.service';

export class OrganizationController {
    constructor(private readonly organizationService: OrganizationService) {}

    public getOrganization = async (
        ctx: Context,
        _params: GetOrganizationRequestParams,
        _body: GetOrganizationRequestBody
    ): Promise<StandardResponse<GetOrganizationResponseBody>> => {
        const organization = await this.organizationService.getOrganization(ctx);

        return {
            status: 200,
            data: organization
        };
    };

    public clearCache = async (
        ctx: Context,
        _params: ClearCacheRequestParams,
        _body: ClearCacheRequestBody
    ): Promise<StandardResponse<ClearCacheRequestBody>> => {
        await this.organizationService.clearCache(ctx);

        return {
            status: 204,
            message: 'Cache manually cleared'
        };
    };
}

export type GetOrganizationRequestParams = object;
export type GetOrganizationRequestBody = object;
export type GetOrganizationResponseBody = object;

export type ClearCacheRequestParams = object;
export type ClearCacheRequestBody = object;
export type ClearCacheResponseBody = object;
