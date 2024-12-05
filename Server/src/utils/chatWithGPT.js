import OpenAI from 'openai'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.API_KEY
})

export const chatWithGPT = async (prompt) => {
  console.log('🚀 ~ chatWithGPT ~ prompt:', prompt)
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    })

    return response.choices[0].message.content || ''
  } 
  catch (error) {
    console.error('Error calling ChatGPT API:', error.response ? error.response.data : error.message)
    throw error
  }
}
