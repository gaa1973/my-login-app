import {DatabaseManager} from "@/db";
import {Books} from "@prisma/client";
import "cross-fetch/polyfill";
import {sendGetRequest} from "@tests/util/send_request";

describe("GET /api/book/:id", () => {
  const prisma = new DatabaseManager().getInstance();
  let expected: Books | null;

  beforeAll(async () => {
    expected = await prisma.books.findUnique({
      where: {
        id: 1,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should return a single book by id", async () => {
    if (!expected) {
      throw new Error("the expected book was not found");
    }
    const res = await sendGetRequest({
      path: `api/books/${expected.id}`,
      expectedStatusCode: 200,
    });
    const actual = await res.json();

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
