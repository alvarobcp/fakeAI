import express from "express";
import axios from "axios";
const app = express();
const port = 3000;
app.use(express.static("public"));

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const d = new Date();

//location info
var latitude;
var longitude;
var country;
var city = "Bicorp";
var region;
var day = weekday[d.getDay()];

//fake user info
var name;
var surname;

var answer="";
var title = "";

//weather info
let temperature; //in celsius
let rain; //in mm
let isDay = false;
let maxTemperature;
let minTemperature;


app.get("/", async (req, res) => {

    try {
          const result = await axios.get("http://ip-api.com/json/95.120.31.134");
          latitude = result.data.lat;
          longitude = result.data.lon;
          country = result.data.country;
          region = result.data.regionName;
          city = result.data.city;
          var answer="";
          var title = "";
          
      } catch (error) {
          console.error("Failed to make request:", error.message);
          res.status(500).send("Failed to fetch activity. Please try again.");
      }

      try {
        const result = await axios.get("https://randomuser.me/api/?nat=es");
        name = result.data.results[0].name.first;
        surname = result.data.results[0].name.last;
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }

    res.render("index.ejs", 
          {
            name: name,
            surname: surname,
            answer:answer,
            title: "",
        });
  });

  app.post("/info", async (req, res) => {

        answer=`I am FakeAI developed by Álvaro Delgado during his Full-Stack development course
        just to practise how to use external APIs.`

        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "Who are you?",
          });
  });

  app.post("/weather", async (req, res) => {

    try {
            const result = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,rain,is_day&daily=temperature_2m_max,temperature_2m_min`);
            
            temperature = result.data.current.temperature_2m;
            rain = result.data.current.rain;
            maxTemperature = result.data.daily.temperature_2m_max[0];
            minTemperature = result.data.daily.temperature_2m_min[0];
            answer = `According to my data (and your IP), you are now in ${city}, so the temperature
            it is ${temperature} ºC outside! The rain expected for today is ${rain} mm.
            Finally, the maximum temperature for today is ${maxTemperature} ºC and the minimum is ${minTemperature} ºC.
            Thanks for trusting me, ${name}!`;
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }

        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "What are the weather conditions?",
          });
  });

  app.post("/location", async (req, res) => {


    try {
        const result = await axios.get("http://ip-api.com/json/95.120.31.134");
        latitude = result.data.lat;
        longitude = result.data.lon;
        country = result.data.country;
        region = result.data.regionName;

        answer = `I can read your IP (be carefull!) so I know you are located in ${city}, ${country}
        in the coordinates (${latitude},${longitude}). Thanks to give me all your IP data, ${name}!`
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }

        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "Where am I right now?",
          });
  });

  app.post("/recipe", async (req, res) => {


    try {
            const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/random.php`);

            answer = `I am going to tell you how to cook ${result.data.meals[0].strMeal}, an
            ${result.data.meals[0].strArea} recipe. Just follow the instructions with lote of love:
             ${result.data.meals[0].strInstructions}`;
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }

        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "Can you tell me a recipe?",
          });
  });

  app.post("/recipe_spanish", async (req, res) => {

        let dish_id = ""

        try {
                const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=Spanish`);
                let n;
                n = Math.floor(Math.random() * result.data.meals.length);
                dish_id = result.data.meals[n].idMeal;

                
            
        } catch (error) {
                console.error("Failed to make request:", error.message);
                res.status(500).send("Failed to fetch activity. Please try again.");
        }

        try {
            const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dish_id}`);
                        
            answer = `Let's cook a Spanish dish! You can try cooking ${result.data.meals[0].strMeal}, just
            follow the instructions: ${result.data.meals[0].strInstructions}`;
        
        } catch (error) {
                console.error("Failed to make request:", error.message);
                res.status(500).send("Failed to fetch activity. Please try again.");
        }


        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "Can you tell me a Spanish recipe?"
          });
  });

  app.post("/recipe_japanese", async (req, res) => {

    let dish_id = ""

    try {
            const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=Japanese`);
            let n;
            n = Math.floor(Math.random() * result.data.meals.length);
            dish_id = result.data.meals[n].idMeal;

            
        
    } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
    }

    try {
        const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dish_id}`);
                    
        answer = `Let's cook a Japanese dish! You can try cooking ${result.data.meals[0].strMeal}, just
            follow the instructions: ${result.data.meals[0].strInstructions}`;
    
    } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
    }


    res.render("index.ejs", 
        {
          name: name,
          surname: surname,
          answer:answer,
          title: "Can you tell me a Japanese recipe?"
      });
});

  app.post("/recipe_dessert", async (req, res) => {

    let dish_id = ""

    try {
            const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert`);
            let n;
            n = Math.floor(Math.random() * result.data.meals.length);
            dish_id = result.data.meals[n].idMeal;

            
        
    } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
    }

    try {
        const result = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${dish_id}`);
                    
        answer = `Desserts are my favourites! You can try cooking ${result.data.meals[0].strMeal}, just
            follow the instructions: ${result.data.meals[0].strInstructions}`;
    
    } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
    }


    res.render("index.ejs", 
        {
          name: name,
          surname: surname,
          answer:answer,
          title: "What kind of dessert I can cook?",
      });
});

  app.post("/drink", async (req, res) => {


    try {
            const result = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`);

            answer = `Be carefull with alcohol! I am thinking (not me, the API) you can
            drink ${result.data.drinks[0].strDrink}. You can prepare it following the instructions:
             ${result.data.drinks[0].strInstructions}. I know I am the best barman!`; 
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }

        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "What can I drink?",
          });
  });

  app.post("/drink_gin", async (req, res) => {

     let id = ""
    try {
            const result = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin`);

            let n;
            n = Math.floor(Math.random() * result.data.drinks.length);
            id = result.data.drinks[n].idDrink;
            console.log(id);
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }

    try {
        const result = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);

        answer = `The barman number one (me) recommends you ${result.data.drinks[0].strDrink}!
        It is made with a lot (hopefully) of gin! Just follow the instructions:
         ${result.data.drinks[0].strInstructions}`; 
    
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.status(500).send("Failed to fetch activity. Please try again.");
    }

        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "I want gin, any idea?",
          });
  });

  app.post("/name", async (req, res) => {

    answer = `You are ${name} ${surname}! (I need to say it is a fake spanish name created with an API, sorry).
    If you are ${name} but your surname is not ${surname}, or your surname is ${surname} but you are not ${name},
    or your gender is different, or you are not Spanish... sorry! I am just practising with APIs!`

       res.render("index.ejs", 
           {
             name: name,
             surname: surname,
             answer:answer,
             title: "Who am I?",
         });
 });

  app.post("/joke", async (req, res) => {

    let id = ""
   try {
           const result = await axios.get(`https://v2.jokeapi.dev/joke/Any?type=single`);

           answer = `${result.data.joke} hahaha!`;
       
       } catch (error) {
           console.error("Failed to make request:", error.message);
           res.status(500).send("Failed to fetch activity. Please try again.");
       }

       res.render("index.ejs", 
           {
             name: name,
             surname: surname,
             answer:answer,
             title: "Tell me a joke."
         });
 });

  app.post("/dark_joke", async (req, res) => {

   try {
           const result = await axios.get(`https://v2.jokeapi.dev/joke/Dark?type=single`);

           answer = `${result.data.joke} wow too much!`;
       
       } catch (error) {
           console.error("Failed to make request:", error.message);
           res.status(500).send("Failed to fetch activity. Please try again.");
       }

       res.render("index.ejs", 
           {
             name: name,
             surname: surname,
             answer:answer,
             title: "Tell me a dark joke."
         });
 });

 app.post("/pikachu", async (req, res) => {

    let mov_list = "";
    try {
            const result = await axios.get(`https://pokeapi.co/api/v2/pokemon/pikachu`);
 
            result.data.moves.forEach(movement => {
                
                mov_list +=  movement.move.name + ", ";
            });

            mov_list += "sleep";
        
            answer = `Pika Pika! Pikachu can use the movements: ${mov_list}.
             There are a lot of movements, it is a great Pokémon!`;
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }
 
        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "I want to know all the Pikachu movements.",
          });
  });

  app.post("/best", async (req, res) => {

    answer = `Álvaro Delgado from Bicorp.`

       res.render("index.ejs", 
           {
             name: name,
             surname: surname,
             answer:answer,
             title: "Who is the best?",
         });
 });

  app.post("/advice", async (req, res) => {

    try {
            const result = await axios.get(`https://api.adviceslip.com/advice`);
 
            answer = `${result.data.slip.advice}`;
        
        } catch (error) {
            console.error("Failed to make request:", error.message);
            res.status(500).send("Failed to fetch activity. Please try again.");
        }
 
        res.render("index.ejs", 
            {
              name: name,
              surname: surname,
              answer:answer,
              title: "Can you give me a piece of advise?"
          });
  });

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });


