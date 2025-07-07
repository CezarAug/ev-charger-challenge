# EV Station reserve app (Node + ExpressJs)

Application created with ![Express generator](https://expressjs.com/en/starter/generator.html)

## Requirements

 - Docker (Redis and PostgresSQL)

## How to Run

Just run the following command in the root directory.

```bash
docker-compose up -d
```

This will start

 - Redis
 - Postgres
 - PGAdmin


## Sending Requests

The default port is 8080, with only one endpoint implemented at POST - /reserve

A Bruno collection was exported and saved at ![Bruno Collection]('./_bruno_collection') showcasing an request example.

Request body example (JSON):
```json
{
  "userId": 1,
  "chargerId": 1,
  "date": "2025-01-01"
}
```

The operation executes the following steps:
 - Does the reservation exists in cache
 - Creates a lock with redis
 - Searches in the DB if the reservation exists, if so aborts the operation and update the cache with the missing reservation.
 - If nothing was found, the reservation is saved in the DB and the cache updated.
 - Lock is released.

### Assumptions, things to change and others.

This is not an official documentation, but the space to register ideas, assumptions, things I'd like to do if I had more time (or would be a huge deviation from the exercise purpose)
 - Documentation/search was limited to only answer questions on getting directions on features I'd do if I was developing in another language/framework.
 - Request body validation was skipped/simplified in order to speed up process. I was initially thinking about using typescript to guarantee more type safety, but since the generator was JS only, I'll continue with JS.
 - For testing purposes the IDs in the database are set in the init.sql, but in real-world scenarios the serial auto-increment might need to be configured to continue from the correct last id.
 - DB layer was based on the suggestion from expressjs docs
 - Custom errors were also skipped
 - Redis cache was implemented following the Redis docs: https://redis.io/learn/develop/node/nodecrashcourse/caching
 - Looking for suggestions from the docs, redlock is the solution for nodeJs https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/
 - Error messages are not real world
 - For simplicity (and speed) the lock was based in the whole day