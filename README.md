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
    
    Example Response:
    {
        data: {
            events: {
                <event key>: <event value>
            },
            hosts: {
                <user key>: <user value>
            }
        }
    }
    
    
### GET: /api/tags/:tag
    
    - Fetches all events that associate with this tag
    
    Example Response:
    {
        data: {
            <event key>: <event value>
        }
    }


### GET: /api/search/users

    - Searches for users based on first name, last name, or email
    - Query Parameters:
    query: The query text
    
    Example Response:
    {
        data: {
            <user key>: <user value>
        }
    }
    

### GET: /api/search/events

    - Searches for events based on its title
    - Query Parameters:
    query: The query text
    
    Example Response:
    {
        data: {
            <event key>: <event value>
        }
    }
    

### GET: /api/search/tags

    - Searches for existing tags based on the tag key
    - Query Parameters:
    query: The query text

    Example Response:
    {
        data: {
            <tag key>: true
        }
    }


### GET: /api/search/all

    - Searches for both events and users
    - Query Parameters:
    query: The query text
    
    Example Response:
    {
        data: {
            events: {
                <event key>: <event value>
            },
            users: {
                <user key>: <user value>
            }
        }
    }
