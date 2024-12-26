import { CryptoModel } from "../models/CryptoModel";
import axios from "axios";

export class ApiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

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

          const cryptoData = new CryptoModel(cryptoDataResponse.name, cryptoDataResponse.symbol, cryptoDataResponse.quote.USD.price, cryptoDataResponse.quote.USD.market_cap, cryptoDataResponse.quote.USD.volume_24h);

          resolve(cryptoData);
        } catch (error) {
          resolve(undefined);
          console.log(error);
        };
      }
    });
  }
}
