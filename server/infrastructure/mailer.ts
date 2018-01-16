import SparkPost = require('sparkpost');

export class Mailer {
    private _client;
    constructor(apiKey?: string) {
        this._client = new SparkPost(apiKey);
    }

    send(transmission: Transmission) {
        if (process.env.NODE_ENV === 'debug') {
            transmission.recipients.forEach(r => {
                const originalEmail = r.address.email;
                r.address.email = process.env.DEBUG_EMAIL;
                r.substitution_data['DebugMessage'] = `DEBUG: Email was intended to be sent to ${originalEmail}.`;
            });
        }
        const s = (<(transmission: Transmission) => Promise<any>>this._client.transmissions.send);
        return s(transmission)
            .catch(error => {
                console.error(error);
            });
    }
}
