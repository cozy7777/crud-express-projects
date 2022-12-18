// const playerData = require('../data/playerData.json')
// let player = "<%= player %>";
let playerApi = 'http://localhost:3000/api/'
let button = document.querySelector('button');

//testing adding stuff to the dom by with the json data
//two ways to access the json data
//hacky way is to go to ejs file
//inside new script tag above src script tag, declare a new var equal to json data players
//best way is to fetch the json data from the server using fetch and then can manipulate the dom as usual with that
//need to keep nesting everything
async function doSomething() {
    //function to loop throught the players and get their names
    // try {
    //     fetch(playerApi)
    //     .then((response) => response.json())
    //     .then((data) => {

    //         let kobe = data.payload[0].name
    //         // testStuff.textContent = kobe 
    //         console.log(data.payload[0].name)
    //     });
       
    // } catch (err) {
    // console.log(err)
    // }

    //function to update their player info with new info
    //needs to have the player name img and number
    try {

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": "Trae Young",
                "number": 11,
                "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png",
                "position": "Guard",
                "height": "6' 1\"",
                "weight": "180lbs",
                "team": "ATLANTA HAWKS",
            })
        };

        const response = await fetch(playerApi, requestOptions)
        const data = await response.json()
        console.log(data);



    } catch(err) {
        console.log(err);
    }
}

button.addEventListener('click', doSomething)
// doSomething()


//can get their stats for the last week or something
//can also get some info from wiki maybe idk


//ideal player data
//height weight might not be available for every player. if no h/w then put n/a
//3 hard code total name, number, image
/* 
{
    name: Kobe Bryant hard code
    position:
    height: fetch and concat feet + inches
    weight: fetch and add lbs
    number: #24 hard code 
    team: fetch full name Los Angeles Lakers
    stats: fetch
    img: hardcode url
}
*/

//use name to search by first name
//need to split then extract first name and last name
//need to fetch search url with first name
//then iterate over results checking for both firstName and lastName to match
//if both match then return the player id
//maybe can do some refactoring on the algo to only check certain ones maybe using the first letter 
//dont need to refactor until later after evrything works
//take player id and fetch again  to get their last game or last weeks stats


//can maybe use fetch with put to add the stats to the existing playerobj
//if not just make a new array of objects to iterate over with for loop maybe and set them like player.name[i] stats.pts[i] etc



//have all the functions set. just need to find a way to refresh data after putting the updates to server

//in order of operations
//get data/names from server
//get rest of data from player using name
//get stats using player name
//update player data with new info using put
//generate html from the fetch
//fetch playerData from server to get player names
//search for player and assign all the stats

//to find stats for the players last game, take all the games from last week or so then take the lst item of array should be the last game

//maybe genrate html first then use put to update data that way dont have to go back and forth
//get playerData > return player data for names
//get player info with names > return all the player info including player id
//get player stats with player id from prev step > return the full data, playerinfo from prev step plus new player stats
//use fetch put first since it returns a message with payload with all the updated player data
//finally generate html with simple function and be done with it

//separate get request and save the current playerData to a var for changing
//new chain, using the new var get the player info using the names
//save all the player info to the new var declared
//then using the playerid from player info get the stats for the game
//then finally after all the info is there generate the html
//then separate fetch for push at the end. push the object?

//maybe dont have it run onload

//load up whatevr the hardcoded info is first
//then push button to refresh data or something maybe
//can act like a update data button since its the last games stats

//2 buttons total
//one button to initiate the get function to get the players names from the database and start the chain to get all the other info
//another button to push all of that new info to server then with the returned promise generate the html for it
//throw in a loading screen maybe

//i think only need one button because the push returns a promise which can be used



//how the hashtag basketball one works
//to update the scoreboard from yahoo
//uses a get request to read the current matchup score
//then populates it all in one go
//and shows a loading 'animation' until its done
//similar to the astronaut one