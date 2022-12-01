
import { expect } from "chai";
import {add} from ".";



describe("add function", () => {
    it("add function success", () => {
        const result = add(1,2);
        expect(result).equal(3);
      });

      it("add function fail", () => {
        const result = add(1,2);
        expect(result).equal(4);
      });
});
