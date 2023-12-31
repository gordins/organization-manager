# Organization Manager

A project to facilitate the organization of People into Groups. The application allows creating groups and people entries, managing their relationships, and viewing the organization structure.

## System Requirements

-   Docker and Docker-compose
-   Node.js for local development

## Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/gordins/organization-manager.git
cd organization-manager
```

2. **Setup environment variables**

Copy the `.env.example` file to `.env` and modify the environment variables if necessary.

```bash
cp .env.example .env
```

3. **Build the Docker containers**

```bash
docker-compose build
```

4. **Start the application**

```bash
docker-compose up
```

5. **Run migrations**

```bash
docker exec -it organization-manager-app-1 npm run migrate
```

6. **Access the application**

The application should now be running on [http://localhost:3000](http://localhost:3000)

## Testing

To run the tests, ensure the application is running and execute:

```bash
docker exec -it organization-manager-app-1 npm run migrate
```

This will run all tests defined in the test directory.

## API Endpoints

### People

-   `GET /people`: Retrieves all people.
-   `GET /people/:id`: Retrieves a single person by ID.
-   `GET /people/:id/memberships`: Retrieves all group memberships of a person (including indirect ones)
-   `POST /people`: Creates a new person; Updates the cache.
-   `PUT /people/:id`: Updates a person; Updates the cache. This is the route to be used to move a person from a group to another.
-   `DELETE /people`: Deletes all people; Updates the cache. This is only for testing purposes;
-   `DELETE /people/:id`: Deletes a person; Updates the cache.

### Groups

-   `GET /groups`: Retrieves all groups.
-   `GET /groups/:id`: Retrieves a single group by ID.
-   `GET /groups/:id/members`: Retrieves all members (people) of a single group, including nested group members.
-   `POST /groups`: Creates a new group; Updates the cache.
-   `PUT /groups/:id`: Updates a group. Updates the cache. This is the route to be used to move groups by providing another `parentGroupId`
-   `DELETE /groups`: Deletes all groups. Updates the cache. This is only for testing purposes
-   `DELETE /groups/:id`: Deletes a group. Updates the cache.

### Organization Structure

-   `GET /organization`: Retrieves the entire organization structure (from cache).
-   `DELETE /organization/cache`: Clears the organization cache.

## Docker Cleanup

To stop and remove all Docker containers, networks, and volumes:

```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker volume rm $(docker volume ls -q)
docker-compose down -v
docker-compose build
docker-compose up

```
