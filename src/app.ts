import express from "express";
import dotenv from "dotenv";
import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import bodyParser from "body-parser";
import botRoutes from "./routes/botRoutes";
import axios from "axios";

dotenv.config();

function runBot() {
    const bot = new Client({
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
        authStrategy: new LocalAuth()
    });
    

    bot.on('ready', () => {
        console.log('Client is ready!');
    });

    bot.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    bot.on('message', async (ctx) => {
        try {
            const message = ctx.body;

            if (message.startsWith('/crypto')) {
                const symbol = message.replace('/crypto', '').trim();
    
                const response = await axios.post('http://localhost:3000/api/webhook', {
                    symbol
                });

                let cryptoData = response.data;

                if (!cryptoData.data) {
                    const invalidSymbol = await ctx.reply(`Símbolo de criptomoeda inválido!`);
                    return;
                }; 

                cryptoData = response.data.data;
                const replyUser = await ctx.reply(`🌎 INFORMAÇÕES SOBRE:\n🪙 *${cryptoData.name}*\n\n*Preço Atual*: $ ${dotsOnNumber(Number(cryptoData.priceUSD).toFixed(2))}\n*CAP*: $ ${dotsOnNumber(Number(cryptoData.marketCAP).toFixed(2))}\n*Volume*: $ ${dotsOnNumber(Number(cryptoData.volume).toFixed(2))}`);

            } else if (message.startsWith('/hello')) {
                const replyUser = await ctx.reply('Quer saber mais sobre uma criptomoeda? 👁️\n\nDigite /crypto + símbolo\n_Por exemplo: /crypto BTC_');
            };
        } catch (error) {
            console.log(error);
        };
    });

    bot.initialize();
};

function dotsOnNumber(number: string) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function initializeApp() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());

  app.use("/api", botRoutes);

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    runBot();
  });
};

