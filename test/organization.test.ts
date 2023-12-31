import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:3000'
});

describe('Organization API', () => {
    it('should retrieve the organization structure', async () => {
        const response = await http.get('/organization');
        expect(response.status).toBe(200);
        expect(typeof response.data).toBe('object');
    });

    it('should clear the cache successfully', async () => {
        const response = await http.delete('/organization/cache');
        expect(response.status).toBe(204);
    });
});
