const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5887076660:AAErITt-OyVu620SYG1R8I8ffOp_kyYPhi8';
const webAppUrl = 'https://bespoke-blini-ca4c6a.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        console.log('start')
        await bot.sendMessage(chatId, 'Ниже появится кнопка, выбери блюдо', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Выбрать блюдо', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products = []} = req.body;
    console.log('products', products)
    try {
        console.log(queryId)
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Cписок покупок',
            input_message_content: {
                message_text: `${products.map((item) => `Блюдо: ${item.title}\n\n Список продуктов: ${item.products.map((product) => product).join(' ,')}\n\n Доп инфо: ${item.description}`).join('\n----------\n')}`
            }
        })
        console.log(res);
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 3000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
