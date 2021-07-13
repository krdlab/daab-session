// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/// <reference types="lisb-hubot" />

import { Session } from "../session";
import { Store } from "../store";
import * as lh from "lisb-hubot";

declare module "lisb-hubot" {
    interface Response<M extends lh.Message> {
        sessionID?: string;
        session?: Session;
        sessionStore?: Store;
    }

    type Middleware = (context: { response: Response<any> }, next: any, done: any) => void;

    interface Robot {
        listenerMiddleware(middleware: Middleware): void;
    }
}
