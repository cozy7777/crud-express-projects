// const playerData = require('../data/playerData.json')
// let player = "<%= player %>";
let playerApi = 'http://localhost:3000/api/'
let searchUrl = 'https://www.balldontlie.io/api/v1/players?search='
let statsUrl = 'https://www.balldontlie.io/api/v1/stats?start_date=2022-12-13&end_date=2022-12-16&player_ids[]='
let getInfo = document.getElementById('get-info');
let pushPop = document.getElementById('brrr');

//grabbing all the dom elemets to update with the new stats
let playerPosition = document.getElementsByClassName('position')
// let nameX = document.getElementsByClassName('name')
let playerHeight = document.getElementsByClassName('height')
let playerWeight = document.getElementsByClassName('weight')
let playerTeam = document.getElementsByClassName('team')
let playerPoints = document.getElementsByClassName('points')
let playerRebounds = document.getElementsByClassName('rebounds')
let playerAssists = document.getElementsByClassName('assists')
let playerSteals = document.getElementsByClassName('steals')
let playerBlocks = document.getElementsByClassName('blocks')

// console.log(nameX[0].textContent);

//new var to hold updated playerdata
let updatedPlayersArr;

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
    // try {

    //     const requestOptions = {
    //         method: 'PUT',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({
    //             "name": "Trae Young",
    //             "number": 11,
    //             "img": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png",
    //             "position": "Guard",
    //             "height": "6' 1\"",
    //             "weight": "180lbs",
    //             "team": "ATLANTA HAWKS",
    //         })
    //     };

    //     const response = await fetch(playerApi, requestOptions)
    //     const data = await response.json()
    //     console.log(data);



    // } catch(err) {
    //     console.log(err);
    // }
}

//putting fetch inside an async function using try catch
async function getJSON(url){
    //try to fetch 
    try {
      const response = await fetch(url);
      //await the response and return it
      return await response.json();
      //if error throw error
    } catch (error) {
      throw error; 
    }
  }

async function getPlayerInfo(url) {
    //grabbing the playerdata from the server
    const playerDataJSON =  await getJSON(url)

    //mapping over the playerdata to fetch the info for each player
    const updatedPlayers = playerDataJSON.payload.map(async (player) => {
        //fething the info for each player using the name key
        const profilesJSON = await getJSON(searchUrl + player.name)

        let playerSet = profilesJSON.data[0]
        // console.log(playerSet);
        //assigning all the new key value pairs to the updated players obj
        player.position = playerSet.position
        player.height = `${playerSet.height_feet}' ${playerSet.height_inches}"`
        player.weight = playerSet.weight_pounds
        player.team = playerSet.team.full_name
        player.id = playerSet.id


        //returning the correct mathcing profile for each player
        // return profilesJSON.data[0]
        //returning the player since thats what we want to pass in the end
        return player

    })
    //returning all the players at once
    return Promise.all(updatedPlayers)
}

async function getPlayerStats(playersObj) {

    const playerStats = playersObj.map(async (player) => {
        const statsJSON = await getJSON(statsUrl + player.id)

        //usually return statsJSON.data which is all the games for the dates probided
        let games = statsJSON.data
        // console.log(games);
        //spliceing the last item of the games arr which is the most recent game
        let lastGame = games.splice(-1, 1)
        lastGame = lastGame[0]
        player.points = lastGame.pts
        player.rebounds = lastGame.reb
        player.assists = lastGame.ast
        player.steals = lastGame.stl
        player.blocks = lastGame.blk


        //returning the most recent game for each player
        return lastGame
    })

    return Promise.all(playerStats)
}
//function to get all the players stats and save it to the updatedplayer object to push later
getInfo.addEventListener('click', async () => {
    try {
        //first fetch to get the local data for the names
        const playerInfo = await getPlayerInfo(playerApi)
        // console.log(updatedPlayersArr);

        //need to get the player stats using the playerid and save it to the updatedplayer object
        const playerStats = await getPlayerStats(playerInfo)
        // console.log(playerInfo);
        // console.log(playerStats);
        updatedPlayersArr = playerInfo
        console.log(playerInfo);
    } catch (err) {
        console.log(err);
    }
})


async function pushPlayers(playersObj) {

    //mapping over and submitting the put request for the players with the new info
    const updatedPlayersInfo = playersObj.map(async (player) => {
            //setting up the request options for the put with the body
            const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": `${player.name}`,
                "number": `${player.number}`,
                "img": `${player.img}`,
                "position": `${player.position}`,
                "height": `${player.height}`,
                "weight": `${player.weight}`,
                "team": `${player.team}`,
                "points": `${player.points}`,
                "rebounds": `${player.rebounds}`,
                "assists": `${player.assists}`,
                "steals": `${player.steals}`,
                "blocks": `${player.blocks}`,
            })
        };
        //call the fetch with the options above
        const response = await fetch(playerApi, requestOptions)
        //returning the response from server for each player update
        const data = await response.json()
        return data

    })
    //returning all of the responses from the server
    return Promise.all(updatedPlayersInfo)
        
}

function generateHTML(playerInfo) {
    console.log(playerInfo);
    // playerInfo.forEach(player => {
    //     playerPosition.textContent = player.position;
    //     playerHeight.textContent = player.height;
    //     playerWeight.textContent = player.weight;
    //     playerTeam.textContent = player.team;
    //     playerPoints.textContent = player.points;
    //     playerRebounds.textContent = player.rebounds;
    //     playerAssists.textContent = player.assists;;
    //     playerSteals.textContent = player.steals;;
    //     playerBlocks.textContent = player.blocks;
    // })

    for(let i = 0; i < playerInfo.length; i++) {
        playerPosition[i].textContent = playerInfo[i].position;
        playerHeight[i].textContent = playerInfo[i].height;
        playerWeight[i].textContent = playerInfo[i].weight;
        playerTeam[i].textContent = playerInfo[i].team;
        playerPoints[i].textContent = playerInfo[i].points;
        playerRebounds[i].textContent = playerInfo[i].rebounds;
        playerAssists[i].textContent = playerInfo[i].assists;;
        playerSteals[i].textContent = playerInfo[i].steals;;
        playerBlocks[i].textContent = playerInfo[i].blocks;
    }
}

//fucntion to push the updated players to server
pushPop.addEventListener('click', async () => {
    console.log(playerPosition);

    try {
        //updating the players and returning all the server responses
        const updatePlayers = await pushPlayers(updatedPlayersArr)
        //only need the last response since it returns all the data
        let newestInfo = updatePlayers.splice(-1, 1)
        newestInfo = newestInfo[0].payload
        console.log(newestInfo);
        //function to generate the html for the new data
        generateHTML(newestInfo)


    } catch (err) {
        console.log(err);
    }


})









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
//get stats using player id
//update player data with new info using put
//generate html from the fetch
//fetch playerData from server to get player names
//search for player and assign all the stats

//to find stats for the players last game, take all the games from last week or so then take the lst item of array should be the last game

//get playerData > return player data for names
//get player info with names > return all the player info including player id
//get player stats with player id from prev step > return the full data, playerinfo from prev step plus new player stats
//use fetch put first since it returns a message with payload with all the updated player data
//finally generate html with simple function and be done with it

//maybe dont have it run onload

//load up whatevr the hardcoded info is first
//then push button to refresh data or something maybe
//can act like a update data button since its the last games stats

//2 BUTTONS TOTAL
//one button to initiate the get function to get the players names from the database and start the chain to get all the other info
//all the new data gets saved to a new object
//that object is the new data that will be pushed/updated to the database

//another button to push all of that new info to server then with the returned promise generate the html for it
//iterate over all of them using map or something saving it to a variable then return that variable after each put request is done using return.all
//then use that new variable which is the newest dataset to populate the html
//throw in a loading screen maybe

//i think only need one button because the push returns a promise which can be used


//how the hashtag basketball one works
//to update the scoreboard from yahoo
//uses a get request to read the current matchup score
//then populates it all in one go
//and shows a loading 'animation' until its done
//similar to the astronaut one