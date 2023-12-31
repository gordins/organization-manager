import { Context } from '../common/context';
import { StandardResponse } from '../models/standardResponse.model';

export class DemoController {
    public getDemo = async (
        _ctx: Context,
        _params: DemoRequestParams,
        _body: DemoRequestBody
    ): Promise<StandardResponse<DemoResponseBody>> => {
        return {
            status: 200,
            message: 'API Working; Demo route'
        };
    };
}

export type DemoRequestParams = object;
export type DemoRequestBody = object;
export type DemoResponseBody = object;
