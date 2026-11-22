export declare class LeScribeAudio {
    description: {
        displayName: string;
        name: string;
        icon: string;
        group: string[];
        version: number;
        subtitle: string;
        description: string;
        defaults: {
            name: string;
        };
        inputs: string[];
        outputs: string[];
        credentials: {
            name: string;
            required: boolean;
        }[];
        properties: ({
            displayName: string;
            name: string;
            type: string;
            noDataExpression: boolean;
            options: {
                name: string;
                value: string;
            }[];
            default: string;
            displayOptions?: undefined;
            required?: undefined;
            description?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            noDataExpression: boolean;
            displayOptions: {
                show: {
                    resource: string[];
                    operation?: undefined;
                };
            };
            options: {
                name: string;
                value: string;
                action: string;
            }[];
            default: string;
            required?: undefined;
            description?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: string;
            required: boolean;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            description: string;
            noDataExpression?: undefined;
            options?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: string;
            required: boolean;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            noDataExpression?: undefined;
            options?: undefined;
            description?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: string;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            noDataExpression?: undefined;
            options?: undefined;
            required?: undefined;
            description?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            options: {
                name: string;
                value: string;
            }[];
            default: string;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            noDataExpression?: undefined;
            required?: undefined;
            description?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: boolean;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            noDataExpression?: undefined;
            options?: undefined;
            required?: undefined;
            description?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: string;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            description: string;
            noDataExpression?: undefined;
            options?: undefined;
            required?: undefined;
        } | {
            displayName: string;
            name: string;
            type: string;
            default: number;
            displayOptions: {
                show: {
                    resource: string[];
                    operation: string[];
                };
            };
            noDataExpression?: undefined;
            options?: undefined;
            required?: undefined;
            description?: undefined;
        })[];
    };
    execute(this: any): Promise<any[][]>;
}
