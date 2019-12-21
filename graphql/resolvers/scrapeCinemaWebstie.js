const cheerio = require("cheerio");
const axios = require("axios");

isValidCity = (city) => {
  // Checks if the city provided has a cinema 
  cities = ['accra', 'westhills', 'ikeja', 'galleria', 'festac', 'sec-abuja', 'jabi', 'uyo' ];
  return cities.includes(city.toLowerCase());
}

scrapeCinemaWebsite = async (city) => {
  // create empty movies array
  const movieList = [];

  // Validate City
  if (!isValidCity(city)) {
    throw new Error(`No silverbird cinema is available in ${city}`);
  }

  try {
    // get website based on city
    const websiteResponse = await axios.get(
      `https://silverbirdcinemas.com/cinema/${city}`
    );
    const { data } = websiteResponse;
    const $ = cheerio.load(data);

    // Get website body and iterate over movie cards
    $("body")
      .find(".cinema-movie .amy-tab-contents .amy-tab-content.active .row .grid-item")
      .each((index, element) => {
        // get entire movie card
        const movieCard = $(element).find(".entry-item");
        
        // get movie title
        const title = $(movieCard)
          .find(".entry-content .entry-title")
          .text();

        // get movie cover image
        const coverImage = $(movieCard)
          .find(".entry-thumb img")
          .attr("src");

        // get duration of movie
        const duration = $(movieCard)
          .find(".entry-content .entry-date")
          .text();

        // get movie's showtimes 
        const showtime = $(movieCard)
          .find(".entry-content .cinema_page_showtime")
          .text();

        // get movie genre
        const genre = $(movieCard)
          .find(".desc-mv .note")
          .text()
          .trim()
          .split(":")[1];
        
        // get movie release date
        const releaseDate = $(movieCard)
          .find(".desc-mv")
          .children("div")
          .eq(0)
          .text()
          .trim()
          .split(":")[1];
        
        // get movie language
        const language = $(movieCard)
          .find(".desc-mv")
          .children("div")
          .eq(2)
          .text()
          .trim()
          .split(":")[1];

        // get movie rating
        const rate = $(movieCard)
          .find(".entry-rating .rate")
          .text()
        
        // get movie rating votes
        const votes = $(movieCard)
          .find(".entry-rating .mcount")
          .text();
        
        // add to movie list 
        movieList.push({
          title,
          coverImage,
          duration,
          showtime,
          genre,
          releaseDate,
          language,
          rating: `${rate} / ${votes}`
        });
      });
  } catch (error) {
    console.log("Error Scraping Website: ", error);
  }

  return movieList;
};

module.exports = scrapeCinemaWebsite;
