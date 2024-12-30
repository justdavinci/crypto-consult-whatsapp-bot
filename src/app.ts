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
    
                const response = await axios.post('http://localhost:3000/api/get-data/crypto', {
                    symbol
                });

                let cryptoData = response.data;

                if (!cryptoData.data) {
                    const invalidSymbol = await ctx.reply(`Símbolo de criptomoeda inválido, ou sintaxe do comando inválida!`);
                    return;
                }; 

                cryptoData = response.data.data;
                const replyUser = await ctx.reply(`🌎 INFORMAÇÕES SOBRE:\n🪙 *${cryptoData.name}*\n\n*Preço Atual*: $ ${dotsOnNumber(Number(cryptoData.priceUSD).toFixed(2))}\n*CAP*: $ ${dotsOnNumber(Number(cryptoData.marketCAP).toFixed(2))}\n*Volume*: $ ${dotsOnNumber(Number(cryptoData.volume).toFixed(2))}`);

            } else if (message.startsWith('/convert')) {
                const convertFiatMessage = message.replace('/convert', '').trim();
                const fiatsSelected = convertFiatMessage.split('to');
                const takingNumber = fiatsSelected[0].split('(');

                let fiatQuantity: any = takingNumber[1].replace(')', '');
                const fiatOne = takingNumber[0];
                const fiatTwo = fiatsSelected[1].trim();


                if (String(fiatQuantity).includes(',')) {
                    console.log('Formatting number...');
                    fiatQuantity = Number(String(fiatQuantity).replace(',', '.'));
                };
    
                fiatQuantity = Number(fiatQuantity);

                const response = await axios.post('http://localhost:3000/api/get-data/fiat/convert', {
                    fiatOne,
                    fiatTwo,
                    fiatQuantity
                });


                const fiatData = response.data.data;
                console.log(fiatData);

                if (!fiatData) {
                    const invalidSymbol = await ctx.reply(`Oops! Algum símbolo de moeda está errado, ou talvez a sintaxe do seu comando. Por favor, tente novamente.`);
                    return;
                }; 

                const replyUser = await ctx.reply(`🪙 *CONVERSÃO*\n\n*${fiatQuantity} ${fiatOne} para ${fiatTwo}*\n\n_PREÇO UNITÁRIO:_ ${(fiatData.convertedFiatData).toFixed(4)}\n\n_CONVERSÃO TOTAL:_ ${(fiatData.priceConverted).toFixed(4)}`);

            } else if (message.startsWith('/start')) {
                const replyUser = await ctx.reply('Olá, eu sou um bot de consulta de criptomoedas e de outros dados econômicos.\n\n⚙️ *COMANDOS DISPONÍVEIS*:\n\n🌎 Quer saber mais sobre uma criptomoeda? 👁️\n\nDigite /crypto + símbolo\n_Por exemplo: /crypto BTC_\n\n🪙 Quer fazer uma conversão de moedas FIAT? 👁️\n\nDigite /convert + moeda1(quantidade) to moeda2\n_Por exemplo: /convert USD(3) to BRL_');
            };
        } catch (error) {
            const replyUser = await ctx.reply("Não consegui entender seu comando, algo está errado. Pode tentar novamente?");
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

