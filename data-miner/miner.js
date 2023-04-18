const hhtps = require('https');
const path = require('path');

export function getMovieData(){
  hhtps.get('https://api.kinopoisk.dev/v1/movie/random', {headers : {'X-API-KEY' : 'RA09X00-G79418E-QRY1HJB-83G1GAF'}}, res => {    
    let data = [];  
    console.log('Status Code:', res.statusCode);

    res.on('data', chunk => {
      data.push(chunk);
    });

    res.on('end', async () => {
      console.log('Response ended: ');
      const parsedData = await JSON.parse(Buffer.concat(data).toString());

      let title = parsedData.alternativeName || parsedData.name;
      let fullpath = path.resolve(__dirname, '..', 'data', title);
      let movieData = {     
        name: "",
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

      for (key in movieData){
        movieData[key] = parsedData[key];
      }
      console.log(parsedData.fees.world);
      console.log(parsedData.fees.russia);
      movieData.fees.world = parsedData.fees.world;
      movieData.fees.russia = parsedData.fees.russia;
      movieData.fees.usa = parsedData.fees.usa;

      return movieData;
    });
  }).on('error', err => {
    console.log('Error: ', err.message);
  });
}