import { AxiosError } from "axios";
import { ApiService } from "../services/apiService";
import { Request, Response } from 'express';
import { CryptoModel } from "../models/CryptoModel";

export class BotController {
    public apiService: ApiService;

    constructor(apiService: ApiService) {
        this.apiService = apiService;
    };

    async getCryptoData(request: Request, response: Response) {
        try {
            const symbol = request.body.symbol;
            const cryptoData = await this.apiService.getCryptoData(symbol);

            return response.status(200).json({
                message: 'Success!',
                data: cryptoData
            });
        } catch(error: any) {
            if (error instanceof AxiosError) {
                return response.status(400).json({
                    message: error.response?.data
                });
            };

            return response.status(500).json({
                message: error.getMessage
            });
        };
    };
};