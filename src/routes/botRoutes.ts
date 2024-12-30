import { Router } from 'express';
import { BotController } from '../controllers/botController';
import { Request, Response } from 'express';
import { ApiService } from '../services/apiService';

import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const api_key: string | undefined = process.env.API_KEY;
const api_key_fiat: string | undefined = process.env.API_KEY_FIAT;
console.log(api_key);

// Validating api_keys
if (!api_key) throw new Error('No api_key.');
if (!api_key_fiat) throw new Error('No api_key.');

const botController = new BotController(new ApiService(api_key, api_key_fiat));


router.post('/get-data/crypto', (request: Request, response: Response) => {
    try {
        botController.getCryptoData(request, response);
    } catch(error) {
        console.log(error);
    };

});

router.post('/get-data/fiat/convert', (request: Request, response: Response) => {
    try {
        botController.getFiatConversion(request, response);
    } catch(error) {
        console.log(error);
    };
});

export default router;