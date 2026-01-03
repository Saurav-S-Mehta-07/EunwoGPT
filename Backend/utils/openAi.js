import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


const getOpenAiApiResponse = async(message)=>{
    try {
      const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    let reply = response.choices[0].message.content;
    return reply;

    } catch (err) {
       console.error(err);
    }
}

export default getOpenAiApiResponse;