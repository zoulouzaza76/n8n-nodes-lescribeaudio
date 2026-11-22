export declare class LeScribeAudioApi {
    name: string;
    displayName: string;
    documentationUrl: string;
    properties: ({
        displayName: string;
        name: string;
        type: string;
        typeOptions: {
            password: boolean;
        };
        default: string;
        required: boolean;
        description: string;
    } | {
        displayName: string;
        name: string;
        type: string;
        default: string;
        required: boolean;
        description: string;
        typeOptions?: undefined;
    })[];
    authenticate: {
        type: string;
        properties: {
            headers: {
                Authorization: string;
            };
        };
    };
    test: {
        request: {
            baseURL: string;
            url: string;
            method: string;
        };
    };
}
