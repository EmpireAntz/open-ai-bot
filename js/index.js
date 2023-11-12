require('dotenv').config()
const fs = require('fs')
const inquirer = require('inquirer')
const { OpenAI } = require('langchain/llms/openai')
const { PromptTemplate } = require('langchain/prompts')

const model = new OpenAI({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
    temperature: 0,
    model: 'gpt-3.5-turbo'
})

const promptFunction = async (name, hometown, hobby, music) => {
    const myPrompt = 'generate a short biography in the first person based on the following inputs: {name}, {hometown}, {hobby}, and {music}.'
    const myPromptTemplate = PromptTemplate.fromTemplate(myPrompt)
    const newChain = myPromptTemplate.pipe(model)
    return await newChain.invoke({
        name,
        hometown,
        hobby, 
        music
    })
}

const init = async () => {
   const resp = await inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?'
        },
        {
            type: 'input',
            name: 'hometown',
            message: 'What is your hometown?'
        }, 
        {
            type: 'input',
            name: 'hobby',
            message: 'what is your favorite hobby?'

        },
        {
            type: 'input',
            name: 'music',
            message: 'what is your favorite music genre?'
        }
    ])
    const bio = await promptFunction(resp.name, resp.hometown, resp.hobby, resp.music)
    const html = 
   `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://cdn.jsdelivr.met/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css">
        <title>Document</title>
    </head>
    <body>
        <header class="p-5 mb-4 header bg-light">
            <div class="container">
                <h1 class="display-4">Hi! My name is ${resp.name}</h1>
                <h2 class="lead">I am from ${resp.hometown}</h2>
                <p>${bio}</p>
            </div>

        </header>
        
    </body>
    </html>`

    fs.writeFile('portfolio.html', html, (err) => {
        console.log(err)
    })
}

init()