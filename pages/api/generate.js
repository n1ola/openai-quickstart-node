import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const ingredients = req.body.ingredients || '';
  if (ingredients.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid ingredients",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(ingredients),
      temperature: 0.2,
      max_tokens: 2048,
    });


    const genImg = await generateImage(completion.data.choices[0].text );
    res.status(200).json({ result: completion.data.choices[0].text, imageResult: genImg });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

async function generateImage(prompt) {
  try {
    const completion = await openai.createImage({
      prompt: prompt,
      size: "256x256",
      n: 1,
      response_format: "url",
    });
    //console.log(JSON.stringify(completion.data.data[0].url));
    return completion.data.data[0].url;
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);

    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);


    }
  }
}


function generatePrompt(ingredients) {
  const capitalizedIngredients =
    ingredients[0].toUpperCase() + ingredients.slice(1).toLowerCase();
  return `Suggerisci un ricetta pasquale dolce con questi ingredienti.

Ingredienti: Uova medie, a temperatura ambiente 5
  Zucchero 150 g
  Baccello di vaniglia 1
  Farina 00 75 g
  Fecola di patate 75 g
  Sale fino 1 pizzico
Ricetta: Per preparare il Pan di Spagna di Pasqua rompete le uova nella ciotola di una planetaria; prendete poi il baccello di vaniglia, incidetelo a metà e con la lama di un coltellino liscio prelevate i semini interni. Aggiungeteli alle uova.
  e unite anche un pizzico di sale 4. Azionate quindi la planetaria a velocità media 5 e lavorate il composto per circa 15-20 minuti in totale, aggiungendo lo zucchero poco per volta 6 in modo da favorirne l'assorbimento.
Ingredienti: ${capitalizedIngredients}
Ricetta:`;
}
