import { AxiosError } from "axios";
import { ApiService } from "../services/apiService";
import { Request, Response } from 'express';
import { CryptoModel } from "../models/CryptoModel";
import { promises } from "node:dns";

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

    async getFiatConversion(request: Request, response: Response) {
        try {
            const fiatRequestBody: any = await request.body;
            const fiatOne = fiatRequestBody.fiatOne;
            const fiatTwo = fiatRequestBody.fiatTwo;
            const fiatQuantity = fiatRequestBody.fiatQuantity;

            const fiatData = await this.apiService.getFiatConversion(fiatOne, fiatTwo, fiatQuantity);

            return response.status(200).json({
                message: 'Success!',
                data: fiatData
            });

        } catch (error: any) {
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