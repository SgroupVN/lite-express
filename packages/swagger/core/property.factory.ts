type DocumentType = 'string' | 'int' | 'dateTime' | 'bool' | 'file' | 'object' | 'array' | 'enum' | 'model'

type CreateParamParams = {
    type?: DocumentType,
    model?: string,
    required?: boolean,
    readOnly?: boolean,
    example?: string,
    name?: string,
    paramsIn?: string,
    description?: string
}

type CreatePropertyParams = {
    type: string,
    model?: string,
    required?: boolean,
    readOnly?: boolean,
    example?: string
}

export class PropertyFactory {
    private static DEFAULT_GENERATOR = 'string';

    private static PRIMITIVE_TYPES = ['string', 'int', 'dateTime', 'bool'];

    private static TYPE_MAP_TO_MODELS = {
        string: {
            type: 'string',
        },
        int: {
            type: 'integer',
            format: 'int64',
        },
        dateTime: {
            type: 'string',
            format: 'date-time',
        },
        bool: {
            type: 'boolean',
            default: true,
        },
        file: {
            type: 'file',
        },
        object: {
            type: 'object',
        },
        array: (item, params = {}) => {
            if (PropertyFactory.PRIMITIVE_TYPES.includes(item)) {
                return {
                    type: 'array',
                    items: {
                        ...PropertyFactory.TYPE_MAP_TO_MODELS[item],
                        ...params,
                    },
                };
            }
            return {
                type: 'array',
                items: {
                    $ref: `#/components/schemas/${item}`,
                },
            };
        },
        enum: (enumModel, params = {}) => ({
            type: 'string',
            enum: Object.values(enumModel),
            ...params,
        }),
        model: (dtoModel, params = {}) => ({
            $ref: `#/components/schemas/${dtoModel}`,
            ...params,
        }),
    };

    private static createSwaggerType({ type, model, example }) {
        return ['enum', 'model', 'array'].includes(type)
            ? PropertyFactory.TYPE_MAP_TO_MODELS[type](model, { example })
            : PropertyFactory.TYPE_MAP_TO_MODELS[type];
    }

    static createProperty(options: CreatePropertyParams) {
        const {
            type,
            model = PropertyFactory.DEFAULT_GENERATOR,
            required = true,
            readOnly = false,
            example,
        } = options;

        const swaggerType = PropertyFactory.createSwaggerType({
            type,
            model,
            example,
        });

        return {
            required,
            example,
            readOnly,
            ...swaggerType,
        };
    }

    static createParam(options: CreateParamParams) {
        const {
            type,
            name,
            model,
            paramsIn = 'query',
            required = true,
            example,
            description,
        } = options;

        const swaggerType = PropertyFactory.createSwaggerType({
            type,
            model,
            example,
        });

        return {
            name,
            in: paramsIn,
            schema: swaggerType,
            required,
            example,
            description,
        };
    }
}
