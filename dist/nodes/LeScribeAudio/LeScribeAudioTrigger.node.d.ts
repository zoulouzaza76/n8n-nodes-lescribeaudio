import type { IHookFunctions, INodeType, INodeTypeDescription, IWebhookFunctions, IWebhookResponseData } from 'n8n-workflow';
/**
 * Verifies the `X-LeScribe-Signature: t=<epoch>,v1=<hex>` header signed by Le Scribe Audio.
 */
export declare function verifyLeScribeSignature(signatureHeader: string, rawBody: Buffer | string, secret: string, maxSkewSeconds?: number): boolean;
export declare class LeScribeAudioTrigger implements INodeType {
    description: INodeTypeDescription;
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
