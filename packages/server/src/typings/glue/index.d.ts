// Generated by typings
// Source: https://raw.githubusercontent.com/jnath/typed-glue/ed6987d571482b35961a99b5db40dd10958a483a/lib/index.d.ts
declare module 'glue' {
import { Server, ServerOptions, ServerConnectionOptions } from 'hapi';

interface Options {
    relativeTo: string;
    preConnections?: (Server:Server, next:(err:any)=>void ) => void;
    preRegister?: (Server:Server, next:(err:any)=>void ) => void;
}

interface Plugin {
    plugin: string | {
        register:string;
        options?:any;
    };
    options?: any;
}

interface Manifest {
    server: ServerOptions;
    connections: Array<ServerConnectionOptions>;
    registrations?: Array<Plugin>;
}

export function compose(manifest: Manifest, options?: Options, callback?: (err?: any, server?: Server) => void):void;
}
