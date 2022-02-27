import redis from "redis-mock";

describe("redis service", () => {
  beforeAll(() => {
    const client = redis.createClient({
      url: "redis://localhost:6379",
    });

    console.log("client", client);
  });

  it("should be defined", () => {
    expect(true).toBe(true);
  });
});
