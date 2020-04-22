import { endSession } from "../src/middleware";
import { Session } from "../src/session";

describe("endSession", () => {
    let session: Session<any, {}>;

    beforeEach(() => {
        session = new Session<any, {}>({ sessionID: "dummy-session-id" }, {});
    });

    it("no action if session is undefined", () => {
        endSession(undefined);
    });

    it("should call session.save", () => {
        const save = jest.spyOn(session, "save");

        endSession(session);

        expect(save).toHaveBeenCalledTimes(1);
    });

    it("should call session.destroy if session is invalid", () => {
        const destory = jest.spyOn(session, "destroy");

        session.invalidate();
        endSession(session);

        expect(destory).toHaveBeenCalledTimes(1);
    });
});
