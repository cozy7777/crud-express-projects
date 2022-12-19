const astrosUrl = 'http://api.open-notify.org/astros.json';
const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const peopleList = document.getElementById('people');
const btn = document.querySelector('button');



// Handle all fetch requests

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

//async function fetch
async function getPeopleInSpace(url) {
    //calling async function to the fetch function we wrote above
    const peopleJSON = await getJSON(url);
  
    //again mapping the data using async 
    const profiles = peopleJSON.people.map(async (person) => {
      const craft = person.craft;
      //using await again to return another promise written above
      const profileJSON = await getJSON(wikiUrl + person.name);
      //returning an object like before
      return { ...profileJSON, craft}
    })
  
    //returning a single promise once all the others resolve
    return Promise.all(profiles)
  }
  // console.log(getPeopleInSpace(astrosUrl));

// Generate the markup for each profile
function generateHTML(data) {
    data.map( person => {
      const section = document.createElement('section');
      peopleList.appendChild(section);
      // Check if request returns a 'standard' page from Wiki
      if (person.type === 'standard') {
        section.innerHTML = `
          <img src=${person.thumbnail.source}>
          <span>${person.craft}</span>
          <h2>${person.title}</h2>
          <p>${person.description}</p>
          <p>${person.extract}</p>
        `;
      } else {
        section.innerHTML = `
          <img src="img/profile.jpg" alt="ocean clouds seen from space">
          <h2>${person.title}</h2>
          <p>Results unavailable for ${person.title}</p>
          ${person.extract_html}
        `;
      }
    });
  }


  //since using try catch need to turn inline func to async func
btn.addEventListener('click',  async (event) => {
    event.target.textContent = "Loading...";
  
    //same as below just using try catch
  
    try {
      //try using the function to return a promise
      const astros = await getPeopleInSpace(astrosUrl)
      //use data from returned promise in generatehtml func
      generateHTML(astros)
    } catch (e) {
      //throwing error
      peopleList.innerHTML = `<h3>Something went wrong</h3>`;
      console.log(e);
    } finally{
      event.target.remove();
    }
  
    // getPeopleInSpace(astrosUrl)
    // .then(generateHTML)
    // .catch(error => {
    //   peopleList.innerHTML = `<h3>Something went wrong</h3>`;
    //   console.log(error);
    // })
    // .finally(() => event.target.remove())
    
  });