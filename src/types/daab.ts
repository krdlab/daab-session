// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/// <reference types="lisb-hubot" />

//import "lisb-hubot";
import { Session } from "../session";
import { Store } from "../store";
import * as lh from "lisb-hubot";
import {
    RespondType,
    JsonContent,
    Stamp,
    YesNoWithResponse,
    SelectWithResponse,
    TaskWithResponse,
    RemoteFile,
    RemoteFiles,
    ActualLocation,
    TextMessage,
} from "lisb-hubot";

declare global {
    namespace daab {
        interface Response<M extends lh.Message, D> extends lh.Response<M> {
            sessionID?: string;
            session?: Session<D>;
            sessionStore?: Store<D>;
        }
        interface ResponseWithJson<T extends JsonContent, D> extends Response<TextMessage, D> {
            json: T;
        }

        type Middleware<D> = (context: { response: Response<any, D> }, next: any, done: any) => void;

        type ListenerCallback<M extends lh.Message, D> = (response: Response<M, D>) => void;
        type TypedJsonCallback<T extends RespondType, J extends JsonContent, D> = (res: ResponseWithJson<J, D>) => void;

        interface Robot<D> extends lh.Robot {
            listenerMiddleware(middleware: Middleware<D>): void;

            hear<M extends lh.Message>(regex: RegExp, callback: ListenerCallback<M, D>): void;
            respond<M extends lh.Message>(regex: RegExp, callback: ListenerCallback<M, D>): void;
            respond(type: "stamp", callback: TypedJsonCallback<"stamp", Stamp, D>): void;
            respond(type: "yesno", callback: TypedJsonCallback<"yesno", YesNoWithResponse, D>): void;
            respond(type: "select", callback: TypedJsonCallback<"select", SelectWithResponse, D>): void;
            respond(type: "task", callback: TypedJsonCallback<"task", TaskWithResponse, D>): void;
            respond(type: "file", callback: TypedJsonCallback<"file", RemoteFile, D>): void;
            respond(type: "files", callback: TypedJsonCallback<"files", RemoteFiles, D>): void;
            respond(type: "map", callback: TypedJsonCallback<"map", ActualLocation, D>): void;
        }
    }
}
