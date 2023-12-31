import { DatabaseConnection } from '../common/connections/database.connection';
import { Context } from '../common/context';
import { BadRequestError } from '../common/errors/badRequest.error';
import { Group } from '../models/group.model';

export class GroupsRepository {
    constructor(private readonly db: DatabaseConnection) {}

    public async getAllGroups(ctx: Context): Promise<Group[]> {
        const sql = 'SELECT * FROM people_groups;';

        const groups: Group[] = await this.db.execute(ctx, sql);

        return groups;
    }

    public async getGroupById(ctx: Context, id: number): Promise<Group> {
        const sql = 'SELECT * FROM people_groups WHERE id = ?;';

        const [group]: Group[] = await this.db.execute(ctx, sql, [id]);

        return group;
    }

    public async getGroupsByParentGroupId(ctx: Context, parentGroupId: number | null): Promise<Group[]> {
        const sql = 'SELECT * FROM people_groups WHERE parent_group_id = ?;';

        const groups: Group[] = await this.db.execute(ctx, sql, [parentGroupId]);

        return groups;
    }

    public async getGroupBranch(ctx: Context, groupId: number): Promise<Group[]> {
        const sql = `
WITH RECURSIVE GroupParents AS (
    SELECT id, parent_group_id, name
    FROM people_groups
    WHERE id = ?

    UNION ALL

    SELECT pg.id, pg.parent_group_id, pg.name
    FROM people_groups pg
    INNER JOIN GroupParents gp ON gp.parent_group_id = pg.id
)
SELECT * FROM GroupParents;
`;
        const result: Group[] = await this.db.execute(ctx, sql, [groupId]);

        return result;
    }

    public async isDescendantOf(
        ctx: Context,
        childGroupId: number | null,
        parentGroupId: number | null
    ): Promise<boolean> {
        const sql = `
WITH RECURSIVE GroupDescendants AS (
    SELECT id, parent_group_id
    FROM people_groups
    WHERE id = ?

    UNION ALL

    SELECT p.id, p.parent_group_id
    FROM people_groups p
    INNER JOIN GroupDescendants gd ON p.parent_group_id = gd.id
)
SELECT COUNT(1) > 0 as isDescendant
FROM GroupDescendants
WHERE id = ?;
`;

        const result = await this.db.execute(ctx, sql, [parentGroupId, childGroupId]);

        return result;
    }

    public async createGroup(ctx: Context, name: string, parentGroupId: number | null): Promise<number> {
        const sql = 'INSERT INTO people_groups (name, parent_group_id) VALUES (?, ?);';

        try {
            const result = await this.db.execute(ctx, sql, [name, parentGroupId]);

            return result.insertId;
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestError('Group name must be unique');
            } else {
                throw error;
            }
        }
    }

    public async updateGroup(ctx: Context, id: number, name: string, parentGroupId: number | null): Promise<number> {
        const sql = 'UPDATE people_groups SET name = ?, parent_group_id = ? WHERE id = ?;';

        try {
            await this.db.execute(ctx, sql, [name, parentGroupId, id]);

            return id;
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new BadRequestError('Group name must be unique');
            } else {
                throw error;
            }
        }
    }

    public async deleteGroups(ctx: Context): Promise<void> {
        const sql = 'DELETE FROM people_groups;';

        await this.db.execute(ctx, sql);
    }

    public async deleteGroup(ctx: Context, id: number): Promise<void> {
        const sql = 'DELETE FROM people_groups WHERE id = ?;';

        await this.db.execute(ctx, sql, [id]);
    }

    public async blindUpdate(ctx: Context, id: number): Promise<void> {
        const sql = 'UPDATE people_groups SET parent_group_id = parent_group_id WHERE id = ?;';

        await this.db.execute(ctx, sql, [id]);
    }
}
