const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const readline = require('readline');
require('dotenv/config');

const client = new OpenAIClient(
    process.env.GPT_ENDPOINT,
    new AzureKeyCredential(process.env.GPT_KEY),
);

const r1 = readline.createInterface({

    input: process.stdin,
    output: process.stdout,
});

const getMessegeFromAPI = async (message) => {
    try {
        const response = await client.getCompletions(process.env.GPT_MODEL,message,
            {
            temperature: 0,    
            maxTokens: 100,
        })
        return response.choices[0].text.trim();
    }   catch (error) {
        console.error(error);
        return 'Desculpe, um erro ocorreu!';

    }
};

const askQuestion = (question) => {
    return new Promise((resolve) => {
        r1.question(question, (answer) => resolve(answer))
    });
};

(async () => {
    console.log('Bem vindo ao ChatBot');
    console.log('Digite "sair" a qualquer momento para sair');

    try {
        while(true) {
            const userMessage = await askQuestion('Você: ');
            
            if (userMessage.toLowerCase() === 'sair') {
                console.log('Até mais!');
                r1.close();
                break;
            }

            const botResponse = await getMessegeFromAPI(userMessage);
            console.log(`Bot: ${botResponse} `);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        r1.close();
        process.exit(1);
    }
})();



