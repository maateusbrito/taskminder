// openaiClient.js
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const getChatCompletion = async (message) => {
    if (!message || typeof message !== 'string') {
        throw new Error("O conteúdo da mensagem deve ser uma string não vazia.");
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Verifique a estrutura da resposta
        const content = response.data.choices[0].message?.content || response.data.choices[0].text;
        console.log('Resposta da OpenAI:', content);
        return content;
    } catch (error) {
        console.error('Erro ao se comunicar com a OpenAI:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = { getChatCompletion };
