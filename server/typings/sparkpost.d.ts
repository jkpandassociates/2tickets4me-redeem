

interface Transmission {
    options?: TransmissionOptions;
    campaign_id?: string;
    recipients: Recipient[];
    content: TransmissionContent;
}

interface TransmissionContent {
    from?: Address;
    subject?: string;
    reply_to?: string;
    headers?: any;
    text?: string;
    html?: string;
    template_id?: string;
    use_draft_template?: boolean;
}

interface TransmissionOptions {
    open_tracking?: boolean;
    click_tracking?: boolean;
}

interface Recipient {
    address: Address;
    tags?: string[];
    metadata?: any;
    substitution_data?: any;
}

interface Address {
    email: string;
    name: string;
}
