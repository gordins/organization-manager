import { DatabaseConnection } from '../common/connections/database.connection';
import { Context } from '../common/context';
import { Person } from '../models/person.model';

export class PeopleRepository {
    constructor(private readonly db: DatabaseConnection) {}

    public async getAllPeople(ctx: Context): Promise<Person[]> {
        const sql = 'SELECT * FROM people;';

        const people: Person[] = await this.db.execute(ctx, sql);

        return people;
    }

    public async getPersonById(ctx: Context, id: number): Promise<Person> {
        const sql = 'SELECT * FROM people WHERE id = ?;';

        const [person]: Person[] = await this.db.execute(ctx, sql, [id]);

        return person;
    }

    public async getPeopleByGroupId(ctx: Context, groupId: number | null): Promise<Person[]> {
        const sql = 'SELECT * FROM people WHERE group_id = ?;';

        const people: Person[] = await this.db.execute(ctx, sql, [groupId]);

        return people;
    }

    public async getPeopleInExtendedGroup(
        ctx: Context,
        groupId: number,
        firstName: string | null,
        jobTitle: string | null
    ) {
        const sql = `
WITH RECURSIVE DescendantGroups AS (
    SELECT id, parent_group_id, name
    FROM people_groups
    WHERE id = ?

    UNION ALL

    SELECT pg.id, pg.parent_group_id, pg.name
    FROM people_groups pg
    INNER JOIN DescendantGroups dg ON dg.id = pg.parent_group_id
)
SELECT p.first_name, p.last_name, p.job_title, p.group_id
FROM people p
JOIN DescendantGroups dg ON p.group_id = dg.id
WHERE (p.first_name LIKE ? OR ? IS NULL)
AND (p.job_title LIKE ? OR ? IS NULL);`;

        const people: Person[] = await this.db.execute(ctx, sql, [groupId, firstName, firstName, jobTitle, jobTitle]);

        return people;
    }

    public async createPerson(
        ctx: Context,
        firstName: string,
        lastName: string,
        jobTitle: string,
        groupId: number | null
    ): Promise<number> {
        const sql = 'INSERT INTO people (first_name, last_name, job_title, group_id) VALUES (?, ?, ?, ?);';

        const result = await this.db.execute(ctx, sql, [firstName, lastName, jobTitle, groupId]);

        return result.insertId;
    }

    public async updatePerson(
        ctx: Context,
        id: number,
        firstName: string,
        lastName: string,
        jobTitle: string,
        groupId: number | null
    ): Promise<number> {
        const sql = 'UPDATE people SET first_name = ?, last_name = ?, job_title = ?, group_id = ? WHERE id = ?;';

        await this.db.execute(ctx, sql, [firstName, lastName, jobTitle, groupId, id]);

        return id;
    }

    public async deletePeople(ctx: Context): Promise<void> {
        const sql = 'DELETE FROM people;';

        await this.db.execute(ctx, sql);
    }

    public async deletePerson(ctx: Context, id: number): Promise<void> {
        const sql = 'DELETE FROM people WHERE id = ?;';

        await this.db.execute(ctx, sql, [id]);
    }
}
