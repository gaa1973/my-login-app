import {books} from "@db/seed/books";
import "cross-fetch/polyfill";
import {sendGetRequest} from "@tests/util/send_request";

describe("GET /api/book", () => {
  test("should return a list of books", async () => {
    const res = await sendGetRequest({
      path: "api/books",
      expectedStatusCode: 200,
    });
    const actual = await res.json();

    expect(actual).not.toBeNull();
    expect(actual).toEqual(books);
  });
});
