import Freecurrencyapi from '@everapi/freecurrencyapi-js';

const {
    CURRENCY_CONVERTER_API: CURRENCY_CONVERTER_API
} = process.env;

export default async function CurrencyConverter() {
    const freecurrencyapi = new Freecurrencyapi(CURRENCY_CONVERTER_API)

    // await freecurrencyapi.latest({
    //     base_currency: 'USD',
    //     currencies: 'ZAR'
    // }).then(response => {
    //     console.log(response);
    // });

    return (
        <p className={`text-sm`}>Exchange rates: USD: 2300, EUR: 1000</p>
    );
}
