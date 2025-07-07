# Q4. Backend Concept and Scaling: 

## a.	How would you implement distributed locking for bookings across a multi-node backend (e.g., Redis, Zookeeper)? 
    On the cache level, Redis can do the locking control for bookings (And it is what I had in mind while drawing the cache layers for the first question). Also if I’m not mistaken with Redis it is possible to data sync even cross regions, with that we can ensure that all instances will have fast updates. For this scenario I believe the key sync point is the data sources (cache and DB replicas).

## b. How can you safely cache search results for nearby chargers and invalidate on booking? 

    I believe with Redis is also possible to achieve a location based cache, and there are some techniques on how split the map into chunks for faster retrieval. However I’m not familiar with that and then for this case study, I’m relying on the index in Postgres for faster location based queries. (Also since the purpose of the case study is to evaluate based on the current knowledge I did not dive into extra investigations).  
    Once a booking happens, the proposed idea is to have an event sent which will be consumed by the admin application that works as a cache manager as well. That service will trigger the required cache eviction command to remove the outdated information. 

## c. How would you enforce fine-grained role-based access control in APIs for users vs. admins? 

    Once the authentication is validated, the authorization service provides the corresponding level of authentication to the user. Each endpoint must validate if the user has the correct grants to proceed with the operation. e.g.: In the Java + Spring world that would be a @PreAuthorize(‘ADMIN’) for checking if the authenticated user has an admin permission.

## d. How would you implement an audit trail for all user booking actions and failed attempts?
    First level would be through application logs. Then in the database level we can create tables for logging and version all changes. The end user would see a list of successful, past and cancelled bookings, while in the database we would have that and also all failed requests as well in the “bookings_history” table or something similar.
    However, with that there is a potential of the database keep growing in a fast pace, so these audit events could be even externalized with its own storage and managed by an service dedicated to audit events.
