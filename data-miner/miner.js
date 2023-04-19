const hhtps = require('https');
const path = require('path');
const fs = require('fs');

let movieData = {     
  name : '',
  enName : '',
  alternativeName : '',
  year: "",
  description: "",
  shortDescription: "",
  slogan: "",
  rating: {
    kp: "",
    imdb: "",
    filmCritics: ""
  },
  votes: {
    kp: "",
    imdb: "",        
    filmCritics: ""
  },
  movieLength: "",
  ageRating: "",
  videos: {
    trailers: [
      {
        url: "",
        name: "",
        site: "",
      }
    ]
  },
  genres: [
    {
      name: ""
    }
  ],
  countries: [
    {
      name: ""
    }
  ],
  persons: [
    {
      id: 1,
      photo: "",
      name: "",
      enName: "",
      description: "",
      profession: "",          
    }
  ],
  reviewInfo: {
    count: 0,
    positiveCount: 0,
    percentage: ""
  },
  budget: {
    value: 3,
    currency: ""
  },
  fees: {
    world: {
      value: 207283,
      currency: "€"
    },
    russia: {
      value: 207283,
      currency: "€"
    },
    usa: {
      value: 207283,
      currency: "€"
    }
  },
  premiere: {}
};

let url1 = 'https://api.kinopoisk.dev/v1/movie/random';
let options1 = {headers : {'X-API-KEY' : 'RA09X00-G79418E-QRY1HJB-83G1GAF'}};

let url2 = 'https://kinopoiskapiunofficial.tech/api/v2.2/films?page='
let options2 = {headers : {'X-API-KEY' : 'a63d8e4c-5cd4-48f2-9789-bf842d878304'}};

let parsing = setInterval(() => {getData(url1, options1)}, 500);
setTimeout(() => {clearInterval(parsing); console.log('parsing finished')}, 100000)

// for (let i = 1; i < 2; i++){
//   getData2(url2, `${options2}${i}`);
// }

function getData2(url, options){
  hhtps.get(url, options, res => {    
    let data = [];  
    console.log('Status Code:', res.statusCode);        

    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', async () => {
      console.log('Response ended: ');
      const parsedData = await JSON.parse(Buffer.concat(data).toString());    

    parsedData.items.forEach(element => {
      for (key in movieData){
        movieData[key] = element[key];
      }      

      let title = parsedData.alternativeName || parsedData.name;
      let fullpath = path.resolve(__dirname, '..', 'data', `${title}.json`);
      
      fs.writeFile(fullpath, JSON.stringify(movieData), (err) => {});
    });           
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
  });
}

function getData(url, options){
  hhtps.get(url, options, res => {    
    let data = [];  
    console.log('Status Code:', res.statusCode);        

    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', async () => {
      console.log('Response ended: ');
      const parsedData = await JSON.parse(Buffer.concat(data).toString());    

      for (key in movieData){
        movieData[key] = parsedData[key];
      }

      let title = parsedData.alternativeName || parsedData.name;
      let fullpath = path.resolve(__dirname, '..', 'data', `${title}.json`);
      
      fs.writeFile(fullpath, JSON.stringify(movieData), (err) => {});
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
  });
}