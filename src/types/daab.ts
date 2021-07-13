// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Session } from "../session";
import { Store } from "../store";
import { Message } from "lisb-hubot";

declare module "lisb-hubot" {
    interface Response<M extends Message> {
        sessionID?: string;
        session?: Session;
        sessionStore?: Store;
    }

    type Middleware = (context: { response: Response<any> }, next: any, done: any) => void;

    interface Robot {
        listenerMiddleware(middleware: Middleware): void;
    }
}
