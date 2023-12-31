import { config } from 'dotenv';
import express from 'express';

import { CacheConnection } from '../common/connections/cache.connection';
import { DatabaseConnection } from '../common/connections/database.connection';
import { Context } from '../common/context';
import { Logger } from '../common/logger';
import { DemoController } from '../controllers/demo.controller';
import { GroupsController } from '../controllers/groups.controller';
import { OrganizationController } from '../controllers/organization.controller';
import { PeopleController } from '../controllers/people.controller';
import { ContextMiddleware } from '../middlewares/context.middleware';
import { ErrorHandlingMiddleware } from '../middlewares/errorHandling.middleware';
import { sendResponse } from '../middlewares/sendResponse.middleware';
import { GroupsRepository } from '../repositories/groups.repository';
import { PeopleRepository } from '../repositories/people.repository';
import { GroupsService } from '../services/groups.service';
import { OrganizationService } from '../services/organization.service';
import { PeopleService } from '../services/people.service';

export class ServerBoostrap {
    public app: express.Express;
    private readonly db: DatabaseConnection;
    private readonly cache: CacheConnection;

    constructor() {
        config();

        this.app = express();
        this.db = new DatabaseConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        });

        this.cache = new CacheConnection(`redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    }

    public async run(ctx: Context): Promise<void> {
        this.configure();
        await this.initializeConnections(ctx);
        this.app.use(new ContextMiddleware().use);
        this.setupRoutes();
        this.app.use(new ErrorHandlingMiddleware().use);
        this.startServer(ctx);
    }

    private configure(): void {
        this.app.use(express.json());
    }

    private async initializeConnections(ctx: Context): Promise<void> {
        try {
            await this.db.connect(ctx);
            Logger.info(ctx, 'Database connected.');
            await this.cache.connect(ctx);
            Logger.info(ctx, 'Redis connected.');
        } catch (error) {
            Logger.error(ctx, 'Error connecting to database or Redis:', error);
        }
    }

    private setupRoutes(): void {
        const demoController = new DemoController();

        const peopleRepository = new PeopleRepository(this.db);
        const groupsRepository = new GroupsRepository(this.db);

        const peopleService = new PeopleService(peopleRepository, groupsRepository);
        const groupsService = new GroupsService(groupsRepository, peopleRepository);
        const organizationService = new OrganizationService(groupsRepository, peopleRepository, this.cache);

        const peopleController = new PeopleController(peopleService, organizationService);
        const groupsController = new GroupsController(groupsService, organizationService);
        const organizationController = new OrganizationController(organizationService);

        this.app.get('/demo', sendResponse(demoController.getDemo));

        this.app.get('/people', sendResponse(peopleController.getPeople));
        this.app.get('/people/:id', sendResponse(peopleController.getPerson));
        this.app.get('/people/:id/memberships', sendResponse(peopleController.getPersonMemberships));
        this.app.post('/people', sendResponse(peopleController.createPerson));
        this.app.put('/people/:id', sendResponse(peopleController.updatePerson));
        this.app.delete('/people', sendResponse(peopleController.deletePeople));
        this.app.delete('/people/:id', sendResponse(peopleController.deletePerson));

        this.app.get('/groups', sendResponse(groupsController.getGroups));
        this.app.get('/groups/:id', sendResponse(groupsController.getGroup));
        this.app.get('/groups/:id/members', sendResponse(groupsController.getGroupMembers));
        this.app.post('/groups', sendResponse(groupsController.createGroup));
        this.app.put('/groups/:id', sendResponse(groupsController.updateGroup));
        this.app.delete('/groups', sendResponse(groupsController.deleteGroups));
        this.app.delete('/groups/:id', sendResponse(groupsController.deleteGroup));

        this.app.get('/organization', sendResponse(organizationController.getOrganization));
        this.app.delete('/organization/cache', sendResponse(organizationController.clearCache));
    }

    private startServer(ctx: Context): void {
        const port = process.env.PORT;
        this.app.listen(port, () => {
            Logger.info(ctx, `Server is running at http://localhost:${port}`);
        });
    }

    public async shutdown(ctx: Context): Promise<void> {
        await this.db.disconnect(ctx);
        await this.cache.disconnect(ctx);
    }
}
