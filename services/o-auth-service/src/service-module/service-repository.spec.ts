import { ServiceRepository } from "./service-repository";

describe("UserRepository", () => {
  it("should be defined", () => {
    expect(new ServiceRepository()).toBeDefined();
  });
});
