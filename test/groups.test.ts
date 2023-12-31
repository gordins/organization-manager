import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

describe('Groups API', () => {
    let groupId: number;
    const groupName = `Development Team ${Date.now()}`;
    const updatedGroupName = `Updated ${groupName}`;

    it('should create a new group', async () => {
        const newGroup = {
            name: groupName,
            parentGroupId: null
        };

        const response = await http.post('/groups', newGroup);
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');

        groupId = response.data.id;
    });

    it('should not allow creating a group with duplicate name', async () => {
        const duplicateGroup = {
            name: groupName,
            parentGroupId: null
        };

        try {
            await http.post('/groups', duplicateGroup);
        } catch (error: any) {
            expect(error.response.status).toBe(409);
        }
    });

    it('should retrieve a list of all groups', async () => {
        const response = await http.get('/groups');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();
    });

    it('should retrieve the details of a single group', async () => {
        const response = await http.get(`/groups/${groupId}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', groupId);
        expect(response.data).toHaveProperty('name', groupName);
    });

    it('should update the details of a group', async () => {
        const updatedGroup = {
            name: updatedGroupName,
            parentGroupId: null
        };

        const response = await http.put(`/groups/${groupId}`, updatedGroup);
        expect(response.status).toBe(204);
    });

    it('should delete a group', async () => {
        const response = await http.delete(`/groups/${groupId}`);
        expect(response.status).toBe(204);
    });

    it('should handle parent group logic correctly', async () => {
        const newGroupResponse = await http.post('/groups', {
            name: 'New Parent Group',
            parentGroupId: null
        });
        const newGroupId = newGroupResponse.data.id;

        try {
            await http.put(`/groups/${newGroupId}`, {
                name: 'New Parent Group',
                parentGroupId: newGroupId
            });
        } catch (error: any) {
            expect(error.response.status).toBe(409);
        }

        await http.delete(`/groups/${newGroupId}`);
    });
});
