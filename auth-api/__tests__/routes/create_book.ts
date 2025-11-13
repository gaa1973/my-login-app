import {DatabaseManager} from "@/db";
import "cross-fetch/polyfill";
import {sendPostRequest} from "@tests/util/send_request";

describe("POST /api/book/", () => {
  const prisma = new DatabaseManager().getInstance();
  const targetBook = {
    title: "create book title",
    author: "create book author",
  };

  afterAll(async () => {
    await prisma.books.deleteMany({
      where: {
        title: {
          contains: "create book title",
        },
      },
    });
    await prisma.$disconnect();
  });

  test("should create a new book", async () => {
    const res = await sendPostRequest({
      path: "api/books",
      expectedStatusCode: 201,
      body: targetBook,
    });
    const actual = await res.json();
    const expected = {
      id: expect.any(Number),
      title: targetBook.title,
      author: targetBook.author,
      genre: null,
      publishedYear: null,
    };

    expect(actual).not.toBeNull();
    expect(actual).toEqual(expected);
  });
});
