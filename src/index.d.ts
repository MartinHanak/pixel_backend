
import {User} from './models/user';

// to make the file a module and avoid the TypeScript error
export {}

/*
declare global {
  namespace Express {
    export interface Response {
      user?: User
    }
  }
}
*/


declare global {
  namespace Express {
    interface Locals {
      user: User
    }
  }
}

/*

// src/index.d.ts
import 'express';
import {User} from './models/user';


interface Locals {
  user?: User;
}

declare module 'express' {
  export interface Response  {
    locals: Locals;
  }
}
*/