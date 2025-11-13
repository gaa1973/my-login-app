import {DatabaseManager} from "@/db";
import {Books} from "@prisma/client";
import "cross-fetch/polyfill";
import {sendDeleteRequest} from "@tests/util/send_request";

describe("DELETE /api/book/:id", () => {
  const prisma = new DatabaseManager().getInstance();
  let expected: Books;

  beforeAll(async () => {
    expected = await prisma.books.create({
      data: {
        title: "delete target title",
        author: "delete target author",
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test("should delete the book by id", async () => {
    const res = await sendDeleteRequest({
      path: `api/books/${expected.id}`,
      expectedStatusCode: 200,
    });
    const actual = await res.json();

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
