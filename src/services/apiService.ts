import { CryptoModel } from "../models/CryptoModel";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export class ApiService {
  private apiKey: string;
  private apiKeyFiat: string;

  constructor(apiKey: string, apiKeyFiat: string) {
    this.apiKey = apiKey;
    this.apiKeyFiat = apiKeyFiat;
  };

  public async getCryptoData(symbol: string) {
    const apiKey = this.apiKey;
    const cryptoSymbol = symbol;

    let response = null;
    return new Promise(async (resolve, reject) => {
      try {
        response = await axios.get(
          "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest",
          {
            headers: {
              "X-CMC_PRO_API_KEY": apiKey,
            },
          }
        );
      } catch (ex) {
        response = null;
        // error
        console.log(ex);
        reject(ex);
      }
      if (response) {
        // success
        try {
          const cryptoDataResponse = await response.data.data.find((crypto: any) => crypto.symbol === symbol);

          if (cryptoDataResponse === undefined) {
            throw new Error('Crypto data not found.');
          };

          const cryptoData = new CryptoModel(cryptoDataResponse.name, cryptoDataResponse.symbol, cryptoDataResponse.quote.USD.price, cryptoDataResponse.quote.USD.market_cap, cryptoDataResponse.quote.USD.volume_24h);

          resolve(cryptoData);
        } catch (error) {
          resolve(undefined);
          console.log(error);
        };
      }
    });
  };

  public async getFiatConversion(fiatOne: string, fiatTwo: string, fiatQuantity: number) {
    let response = null;
    const apiKey = this.apiKeyFiat;

    return new Promise(async (resolve, reject) => {
      try {
        response = await axios.get(
          `https://economia.awesomeapi.com.br/json/last/${fiatOne}-${fiatTwo}`,
          {
            headers: { 'x-api-key': apiKey },
          }
        );
      } catch (ex) {
        response = null;
        // error
        console.log(ex);
        reject(ex);
      }
      if (response) {
        // success
        try {
          const fiatData = response.data;

          if (fiatData === undefined || typeof(fiatQuantity) !== "number") {
            throw new Error('Fiat data not found.');
          };

        
          const convertedFiatData = Number(fiatData[`${fiatOne}${fiatTwo}`].ask);
          const priceConverted = fiatQuantity * Number(convertedFiatData);

          resolve({ convertedFiatData, priceConverted });
        } catch (error) {
          resolve(undefined);
          console.log(error);
        };
      };
    });
  };
};
