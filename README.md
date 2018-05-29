# LetsMeet Backend Server

Backend used for push notifications and complex searches.

## Endpoints

### GET: /api/events/all

    - Fetches all events in firebase
    
    Example Response:
    {
        data: {
            <event key>: <event value>
        }
    }
    
### GET: /api/events/feed

    - Fetches feed events that are in a radius around a location specified and that happen in
    a specified days from now
    - Query Parameters:
    lat: latitude of the center
    lng: longitude of the center
    radius: Radius from the center
    daysFromNow: A filter that includes only events that happen in daysFromNow



### GET: /api/search/users

    - Searches for users based on first name, last name, or email
    - Query Parameters:
    query: The query text

### GET: /api/search/events

    - Searches for events based on its title
    - Query Parameters:
    query: The query text

### GET: /api/search/all

    - Searches for both events and users
    - Query Parameters:
    query: The query text
