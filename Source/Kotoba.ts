import express, { Express, Request, Response, NextFunction, RequestHandler } from "express";

type RequestMethod = "get" | "delete" | "post" | "patch" | "put";

interface RequestOptions {
  method: RequestMethod;
  route: string;
  auth?: (req: Request, res: Response, next: NextFunction) => void;
  callback: (request: Request, response: Response, next: NextFunction) => void;
}

interface SetRequestAndResponseType {
  getBody: <T>(property: string) => Promise<T>;
  getQuery: <T>(property: string) => Promise<T>;
  getParam: <T>(property: string) => Promise<T>;
}

export class Kotoba {
  private app: Express;
  public port: number;
  constructor(public _port: number) {
    this.app = express();
    this.port = _port;
  }

  public store(key: string, value: any): this {
    this.app.set(key, value);
    return this;
  }

  public middleware(middleware: RequestHandler): this {
    this.app.use(middleware);
    return this;
  }

  public createRequest(options: RequestOptions): this {
    const method = options.method.toLowerCase();
    if (!["get", "post", "put", "delete", "patch"].includes(method)) {
      throw new Error(`Unsupported method: ${options.method}`);
    }

    this.app[method](options.route, (req: Request, res: Response, next: NextFunction) => {
      if (options.auth) {
        options.auth(req, res, next);
      } else {
        next();
      }
    }, options.callback);

    return this;
  }

  public setRequestAndResponse(req: Request, res: Response): SetRequestAndResponseType {
    function f<T>(p: string, pp: string, m: string): Promise<T> {
      return new Promise((resolve, reject) => {
        if (req[p] && Object.prototype.hasOwnProperty.call(req[p], pp)) {
          resolve(req[p][pp]);
        } else {
          reject(new Error(m))
        }
      })
    }
    return {
      getBody: (property: string) => { return f("body", property, `Property '${property}' not found in request body`); },
      getQuery: (property: string) => { return f("query", property, `Property '${property}' not found in request query`); },
      getParam: (property: string) => { return f("params", property, `Property '${property}' not found in request params`) }
    };
  }

  public startApp(logMessage?: string): void {
    this.app.listen(this.port, () => {
      if (logMessage) {
        console.log(logMessage);
      } else {
        console.log(`Server started on port ${this.port}`);
      }
    });
  }
}



