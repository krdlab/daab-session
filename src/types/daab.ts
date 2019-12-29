// Copyright (c) 2019 Sho Kuroda <krdlab@gmail.com>
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/// <reference types="hubot" />

import Hubot from 'hubot';
import { Session } from '../lib/session';
import { Store } from '../lib/store';

declare global {
    namespace Hubot {
        interface Message {
            room: string;
        }
    }
    namespace daab {
        class Response<R, D> extends Hubot.Response<R> {
            sessionID?: string;
            session?: Session<R, D>;
            sessionStore?: Store<R, D>;
        }

        type Middleware<R, D> = (context: { response: Response<R, D> }, next: any, done: any) => void;
        type ListenerCallback<R, D> = (response: Response<R, D>) => void;

        class Robot<A, D> extends Hubot.Robot<A> {
            listenerMiddleware(middleware: Middleware<this, D>): void;

            catchAll(callback: ListenerCallback<this, D>): void;
            catchAll(options: any, callback: ListenerCallback<this, D>): void;
            hear(regex: RegExp, callback: ListenerCallback<this, D>): void;
            hear(regex: RegExp, options: any, callback: ListenerCallback<this, D>): void;
            respond(regex: RegExp, callback: ListenerCallback<this, D>): void;
            respond(regex: RegExp, options: any, callback: ListenerCallback<this, D>): void;
            enter(callback: ListenerCallback<this, D>): void;
            enter(options: any, callback: ListenerCallback<this, D>): void;
            topic(callback: ListenerCallback<this, D>): void;
            topic(options: any, callback: ListenerCallback<this, D>): void;
        }
    }
}
