import {DatabaseManager} from "@/db";
import "cross-fetch/polyfill";
import {sendPatchRequest} from "@tests/util/send_request";
import {Books} from "@prisma/client";

describe("PATCH /api/book/:id", () => {
  const prisma = new DatabaseManager().getInstance();
  const updateTitle = "updated book title";
  let targetBook: Books;

  beforeAll(async () => {
    targetBook = await prisma.books.create({
      data: {
        title: "update book title",
        author: "update book author",
      },
    });
  });

  afterAll(async () => {
    await prisma.books.delete({
      where: {
        id: targetBook.id,
      },
    });
    await prisma.$disconnect();
  });

  test("should update a book title", async () => {
    const res = await sendPatchRequest({
      path: `api/books/${targetBook.id}`,
      expectedStatusCode: 200,
      body: {
        title: updateTitle,
      },
    });
    const actual = await res.json();
    const expected = {
      id: targetBook.id,
      title: updateTitle,
      author: targetBook.author,
      genre: null,
      publishedYear: null,
    };

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
