import {books} from "@db/seed/books";
import "cross-fetch/polyfill";
import {sendGetRequest} from "@tests/util/send_request";

describe("GET /api/books/search", () => {
  test("should return a list of books matching the search query", async () => {
    const res = await sendGetRequest({
      path: "/api/books/search",
      expectedStatusCode: 200,
      params: {title: "robot"},
    });
    const actual = await res.json();
    const expected = books.filter(book => book.title.includes("robot"));

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
