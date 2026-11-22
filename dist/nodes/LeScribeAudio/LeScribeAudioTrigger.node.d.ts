/**
 * Verifies the `X-LeScribe-Signature: t=<epoch>,v1=<hex>` header signed by Le Scribe Audio.
 */
export declare function verifyLeScribeSignature(signatureHeader: string, rawBody: Buffer | string, secret: string, maxSkewSeconds?: number): boolean;
export declare class LeScribeAudioTrigger {
    description: {
        displayName: string;
        name: string;
        icon: string;
        group: string[];
        version: number;
        description: string;
        defaults: {
            name: string;
        };
        inputs: any[];
        outputs: string[];
        credentials: {
            name: string;
            required: boolean;
        }[];
        webhooks: {
            name: string;
            httpMethod: string;
            responseMode: string;
            path: string;
        }[];
        properties: ({
            displayName: string;
            name: string;
            type: string;
            options: {
                name: string;
                value: string;
            }[];
            default: string[];
            required: boolean;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: boolean;
            options?: undefined;
            required?: undefined;
        })[];
    };
    webhookMethods: {
        default: {
            checkExists(this: any): Promise<boolean>;
            create(this: any): Promise<boolean>;
            delete(this: any): Promise<boolean>;
        };
    };
    webhook(this: any): Promise<any>;
}
