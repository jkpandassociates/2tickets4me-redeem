import SparkPost = require('sparkpost');

export class Mailer {
    private _client;
    constructor(apiKey?: string) {
        this._client = new SparkPost(apiKey);
    }

    send(transmission: Transmission) {
        let s = (<(transmission: Transmission) => Promise<any>>this._client.transmissions.send);
        s(transmission)
            .then(_ => {
                debugger;
            })
            .catch(error => {
                console.error(error);
            });
    }
}
