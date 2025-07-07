# Q5. Angular interaction model
## a. You are building a reservation UI in Angular. Describe
### 1. How you'd use RxJS to manage API calls, debounce inputs, and update UI
    In Angular applications we can use NgRx. With that we can create effects to control API calls and control the whole Angular application State.
    
    Through the state we can propagate the UI changes.

    And to avoid multiple calls, repeated calls for every user interaction debounce configurations come to help (e.g.: Wait for a couple miliseconds before actually sending the request.)  

### 2. How you'd show partial results while waiting for full geo-search to complete

    One way could be using websockets and subscribe for the updates coming from the server side, so instead of a traditional API, the frontend would receive a constant stream of EV charging stations.
    
    Another possibility would be to use filters in a smarter way:
     - Initial requests would only require the location of each EV station without the full details of that station
     - Once they are received, requests for getting the EV station details are triggered in order to get the full data.
        - e.g.: User starts zooming out from far, there is no need to get all details only the existance of those EV stations (Could be even grouped into numbers). And once there is a zoom in, the detailed data has to be loaded as well.
    
    A third option could be limiting the "interactivity", by requesting the user to set up a pin first and then search the stations. That would leave more room to have all the data ready, but in the other hand would damage the user experience heavily. (Not recommended). 
