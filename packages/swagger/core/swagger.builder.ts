type SwaggerDocument = {
    openapi: string;
    info:string;
    servers:string;
    basePath:string;
    components: {
        schemas: Object;
    },
    tags: Array<string>;
    paths: Object;
}

type SwaggerOptions = Pick<SwaggerDocument, 'openapi' | 'info' | 'servers' | 'basePath'> & {
    auth: 'bearer'
}

type RouteParams = {
    route?: any;
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
    tags?: string | string[];
    description?: any;
    security?: any;
    model?: string;
    body?:any;
    params?:any;
    consumes?:any;
    rawBody?: any;
    errors: any;
}

type ModelParams = {
    name: string;
    properties: any,
    type?: typeof Array;
}

export class SwaggerBuilder {
    private readonly instance: SwaggerDocument;
    private resolvers = [];

    constructor({ openapi, info, servers, auth, basePath }: SwaggerOptions) {
        this.instance = {
            openapi,
            info,
            servers,
            basePath,
            components: {
                schemas: {},
            },
            tags: [],
            paths: {}
        };

        if (auth === 'bearer') {
            this.instance.components['securitySchemes'] = {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            };
        }
    }

    private static toResponseSuccess(model: string) {
        return {
            200: {
                description: 'successful operation',
                content: model
                  ? {
                      'application/json': {
                          schema: {
                              type: 'array',
                              items: {
                                  $ref: `#/components/schemas/${model}`,
                              },
                          },
                      },
                  }
                  : '',
            },
        };
    }

    private static toErrors(errors) {
        const responses = {};

        errors.forEach(error => {
            if (!error.status || !error.description) {
                throw new Error(
                  'Error in swagger must contain status and description',
                );
            }
            responses[error.status] = {
                description: error.description,
            };
        });
        return responses;
    }

    addTag(name: string) {
        this.resolvers.push(() => {
            if (!this.instance.tags.some(tag => tag === name)) {
                this.instance.tags.push(name);
            }
        });
    }

    addRoute(options: RouteParams) {
        this.resolvers.push(() => {
            const {
                route,
                method,
                tags,
                description,
                security,
                model,
                body,
                params = [],
                consumes = [],
                errors = [],
                rawBody,
            } = options;
            const responses = {};

            if (!this.instance.paths[route]) {
                this.instance.paths[route] = {};
            }

            this.instance.paths[route][method] = {
                tags: tags.length ? tags : [tags],
                description,
                security: security
                    ? [
                          {
                              bearerAuth: [],
                          },
                      ]
                    : [],
                produces: ['application/json'],
                consumes,
                parameters: params,
                requestBody: body
                    ? {
                          content: {
                              'application/json': {
                                  schema: {
                                      $ref: `#/components/schemas/${body}`,
                                  },
                              },
                          },
                          required: true,
                      }
                    : rawBody || {},
                responses: {
                    ...responses,
                    ...SwaggerBuilder.toResponseSuccess(model),
                    ...SwaggerBuilder.toErrors(errors),
                },
            };
        });
    }

    addModel({ name, properties, type }: ModelParams) {
        this.resolvers.push(() => {
            if (type === Array) {
                this.instance.components.schemas[name] = {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties,
                    },
                };
                return;
            }

            this.instance.components.schemas[name] = {
                type: 'object',
                properties,
            };
        });
    }

    build(): SwaggerDocument {
        this.resolvers.map(resolver => resolver());
        return this.instance;
    }
}
