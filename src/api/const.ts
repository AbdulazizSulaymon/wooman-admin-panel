import { fixedConfigInterface } from './types';

export function toCamelCase(s: string) {
  return (
    s
      // @ts-ignore
      .split(' ')
      .map((x: string, i: number) => {
        if (i > 0) return x.charAt(0).toUpperCase() + x.slice(1);
        else return x.charAt(0).toLowerCase() + x.slice(1);
      })
      .join('')
  );
}

export function toPascalCase(s: string) {
  return (
    s
      // @ts-ignore
      .split(' ')
      .map((x: string) => x.charAt(0).toUpperCase() + x.slice(1))
      .join('')
  );
}

export const replace = (s: any, model: Record<string, unknown> & { name: string }) => {
  if (typeof s == 'string')
    return s
      .replace('NAME_PASCAL', model.name)
      .replace('NAME_CAMEL', toCamelCase(model.name))
      .replace('ENTITY', model.name)
      .replace('CREATE_DTO', `Create${model.name}Dto`)
      .replace('CONNECT_DTO', `Connect${model.name}Dto`)
      .replace('FIND_DTO', `Find${model.name}Dto`)
      .replace('UPDATE_DTO', `Update${model.name}Dto`);
  return s;
};

export const apiCoreFunctions: fixedConfigInterface = {
  exist: {
    permission: 'Read',
    // query: 'FIND_DTO',
    // body: 'FIND_DTO',
    body: 'any',
    fixedPath: 'exist',
    resp: `Boolean`,
    info: 'Exist ENTITY with filter as Query (operation - findFirst, return !!ret)',
    service: `    
      const ret = await this.prismaService.NAME_CAMEL.findFirst(body);
      return !!ret;`,
    responses: [
      {
        description: 'NAME_PASCAL',
        type: 'Boolean',
        status: 200,
      },
    ],
  },
  findMany: {
    permission: 'Read',
    // query: 'FIND_DTO',
    // body: 'FIND_DTO',
    body: 'any',
    fixedPath: 'find-many',
    resp: `ENTITYArray`,
    info: 'get all ENTITY with filter as Query (operation - findMany)',
    service: `    
      const [totalCount, data] = await Promise.all([
        this.prismaService.NAME_CAMEL.count(),
        plainToInstance(ENTITY, await this.prismaService.user.findMany(body)),
      ]);
      return { totalCount, data };`,
    responses: [
      {
        description: 'ENTITYArray',
        type: '[ENTITYArray]',
        status: 200,
      },
    ],
  },
  findOne: {
    permission: 'Read',
    // param: 'CONNECT_DTO',
    // body: 'CONNECT_DTO',
    body: 'any',
    fixedPath: 'find-first',
    resp: `ENTITY`,
    info: 'find one ENTITY (operation - findFirst)',
    service: `
      // if (param.id) param.id = +param.id;    
      const ret = await this.prismaService.NAME_CAMEL.findFirst(body);
      return ret;`,
    responses: [
      {
        description: 'NAME_CAMEL',
        type: 'ENTITY',
        status: 200,
      },
    ],
  },
  createOne: {
    permission: 'Create',
    // body: 'CREATE_DTO',
    body: 'any',
    fixedPath: 'create',
    resp: `ENTITY`,
    info: 'create ENTITY (operation - create)',
    service: `
      const ret = await this.prismaService.NAME_CAMEL.create(body);
      return ret;`,
    responses: [
      {
        description: 'CONNECT_DTO',
        status: 201,
        type: 'ENTITY',
      },
    ],
  },
  createMany: {
    permission: 'Create',
    // body: 'CREATE_DTO',
    body: 'any',
    // bodyArray: true,
    fixedPath: 'create-many',
    resp: `Number`,
    info: 'create many ENTITY (operation - createMany)',
    service: `    
      const ret = await this.prismaService.NAME_CAMEL.createMany(body);
      return ret.count;`,
    responses: [
      {
        description: 'FIND_DTO',
        status: 201,
        type: 'Number',
      },
    ],
  },
  updateMany: {
    permission: 'Update',
    // param: 'CONNECT_DTO',
    // body: 'UPDATE_DTO',
    body: 'any',
    // paramArray: true,
    fixedPath: 'update-many',
    resp: `Number`,
    info: 'update many ENTITY (operation - updateMany)',
    service: `
      const ret = await this.prismaService.NAME_CAMEL.updateMany(body);
      return ret.count;`,
    responses: [
      {
        description: 'FIND_DTO',
        status: 202,
        type: 'Number',
      },
      {
        status: 406,
        description: 'Not Acceptable',
      },
      {
        status: 409,
        description: 'Conflict',
      },
    ],
  },
  updateOne: {
    permission: 'Update',
    // body: 'UPDATE_DTO',
    body: 'any',
    // param: 'CONNECT_DTO',
    fixedPath: 'update',
    resp: `ENTITY`,
    info: 'update unique ENTITY (operation - update)',
    service: `
      // if (param.id) param.id = +param.id;
      const ret = await this.prismaService.NAME_CAMEL.update(body);
      return ret;`,
    responses: [
      {
        description: 'UPDATE_DTO',
        status: 202,
        type: 'ENTITY',
      },
      {
        status: 406,
        description: 'Not Acceptable',
      },
      {
        status: 409,
        description: 'Conflict',
      },
    ],
  },
  deleteMany: {
    permission: 'Delete',
    // param: 'CONNECT_DTO',
    // body: 'CONNECT_DTO',
    body: 'any',
    // paramArray: true,
    fixedPath: 'delete-many',
    resp: `Number`,
    info: 'Delete many ENTITY  (operation - deleteMany)',
    service: `
      const ret = await this.prismaService.NAME_CAMEL.deleteMany(body);
      return ret.count;`,
    responses: [
      {
        description: 'FIND_DTO',
        status: 202,
        type: 'Number',
      },
      {
        status: 406,
        description: 'Not Acceptable',
      },
      {
        status: 409,
        description: 'Conflict',
      },
    ],
  },
  deleteAll: {
    permission: 'Delete',
    fixedPath: 'delete-all',
    resp: `Number`,
    info: 'delete all ENTITY (send empty body) (operation - deleteMany({ }))',
    service: `
      const ret = await this.prismaService.NAME_CAMEL.deleteMany({ });
      return ret.count;`,
    responses: [
      {
        description: 'FIND_DTO',
        status: 202,
        type: 'Number',
      },
      {
        status: 406,
        description: 'Not Acceptable',
      },
      {
        status: 409,
        description: 'Conflict',
      },
    ],
  },
  deleteOne: {
    permission: 'Delete',
    // param: 'CONNECT_DTO',
    // body: 'CONNECT_DTO',
    body: 'any',
    fixedPath: 'delete',
    resp: `ENTITY`,
    info: 'delete one ENTITY (operation - delete)',
    service: `
      // if (param.id) param.id = +param.id;
      const ret = await this.prismaService.NAME_CAMEL.delete(body);
      return ret;`,
    responses: [
      {
        description: 'UPDATE_DTO',
        status: 202,
        type: 'ENTITY',
      },
      {
        status: 406,
        description: 'Not Acceptable',
      },
      {
        status: 409,
        description: 'Conflict',
      },
    ],
  },
};
