import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

describe('People API', () => {
    let personId: number;
    const timestamp = Date.now();

    const firstName = `Stefan ${timestamp}`;
    const lastName = `Gordin ${timestamp}`;
    const jobTitle = `Software Engineer ${timestamp}`;
    const updatedJobTitle = `Senior ${jobTitle}`;

    it('should create a new person', async () => {
        const newPerson = {
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            groupId: null
        };

        const response = await http.post('/people', newPerson);
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');

        personId = response.data.id;
    });

    it('should retrieve a list of all people', async () => {
        const response = await http.get('/people');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBeTruthy();

        const expectedPerson = response.data.find((people: any) => people.id === personId);
        expect(expectedPerson).toBeTruthy();
        expect(expectedPerson).toHaveProperty('lastName', lastName);
    });

    it('should retrieve the details of a single person', async () => {
        const response = await http.get(`/people/${personId}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('id', personId);
    });

    it('should update the details of a person', async () => {
        const updatedPerson = {
            firstName: firstName,
            lastName: lastName,
            jobTitle: updatedJobTitle
        };

        const response = await http.put(`/people/${personId}`, updatedPerson);
        expect(response.status).toBe(204);
    });

    it('should delete a person', async () => {
        const response = await http.delete(`/people/${personId}`);
        expect(response.status).toBe(204);
    });
});
