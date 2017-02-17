import SparkPost = require('sparkpost');

export class Mailer {
    private _client;
    constructor(apiKey?: string) {
        this._client = new SparkPost(apiKey);
    }

    send(transmission: Transmission) {
        let s = (<(transmission: Transmission) => Promise<any>>this._client.transmissions.send);
        return s(transmission)
            .catch(error => {
                console.error(error);
            });
    }
}
