import { setupServer } from "msw/node";
import { rest } from "msw";
import { http } from "utils/http";

const apiUrl = process.env.REACT_APP_API_URL;

const server = setupServer();

// jest是对react最友好的一个测试库
// 执行所有测试之前，先执行回调哈数
beforeAll(() => server.listen());

// 每一个测试跑完后，重置模拟路由
afterEach(() => server.resetHandlers());

// 所有测试跑完后，关闭mock路由
afterAll(() => server.close());

test("http方法发送异步请求", async () => {
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  server.use(
    rest.get(`${apiUrl}/${endpoint}`, (req, res, ctx) =>
      res(ctx.json(mockResult))
    )
  );
  const result = await http(endpoint);
  // toBe 是严格相等
  expect(result).toEqual(mockResult);
});

test("http请求时会在header里带上token", async () => {
  const token = "fake_token";
  const endpoint = "test-endpoint";
  const mockResult = { mockValue: "mock" };

  let request: any;
  server.use(
    rest.get(`${apiUrl}/${endpoint}`, async (req, res, ctx) => {
      request = req;
      return res(ctx.json(mockResult));
    })
  );

  await http(endpoint, { token });
  expect(request.headers.get("Authorization")).toBe(`Bearer ${token}`);
});
