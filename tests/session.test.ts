import { Session } from "../src/session";
import { MemoryStore } from "../src/store/memory";

type Data = { count: number };

describe("session", () => {
    let session: Session<any, Data>;

    beforeEach(() => {
        session = new Session(
            {
                sessionID: "session-id",
                sessionStore: new MemoryStore<any, Data>(),
            },
            {}
        );
    });

    it("should be invalid if call invalidate method", () => {
        session.invalidate();
        expect(session.isInvalid).toBe(true);
    });

    it("should keep data", () => {
        session.data.count = 123;
        session.save();
        expect(session.data.count).toBe(123);
    });

    it("should throw 'invalid' error if session is invalid", () => {
        session.invalidate();
        expect(() => {
            session.save();
        }).toThrowError("is invalid");
    });

    it("should call Store's set method", () => {
        const mockSet = jest.spyOn(session.res.sessionStore!, "set");
        const cb = () => {};

        session.save(cb);

        expect(mockSet).toHaveBeenCalledWith(session.id, session.data, cb);
    });

    it("should call Store's destroy method", () => {
        const mockDestroy = jest.spyOn(session.res.sessionStore!, "destroy");
        const cb = () => {};

        session.destroy(cb);

        expect(mockDestroy).toHaveBeenCalledWith(session.id, cb);
    });
});
