import { Router } from 'express';
import { BotController } from '../controllers/botController';
import { Request, Response } from 'express';
import { ApiService } from '../services/apiService';
import { CryptoModel } from '../models/CryptoModel';

import dotenv from 'dotenv';
dotenv.config();

const router = Router();
const api_key: string | undefined = process.env.API_KEY;
console.log(api_key);

// Validating api_key
if (!api_key) throw new Error('No api_key.');

const botController = new BotController(new ApiService(api_key));

router.post('/webhook', (request: Request, response: Response) => {
    try {
        botController.getCryptoData(request, response);

    } catch(error) {
        console.log(error);
    };

});

export default router;