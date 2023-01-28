const express = require("express");
const cors = require("cors");
require("dotenv").config();

// OPENAI CONFIGURATION
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// INIT APP
const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// POST REQUEST TO OPENAI
app.post("/", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) {
    res.status(400).json({ message: "Please input some prompt" });
    return;
  }
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 3900,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 0.1,
      stop: ["\n"],
    });
    res.status(200).json(response.data.choices[0].text);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
});

app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
