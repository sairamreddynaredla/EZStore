import test from "node:test";
import assert from "node:assert/strict";
import apiRouter from "../src/routes/index.js";

const collectRoutePaths = (routerInstance) => {
  const paths = [];

  for (const layer of routerInstance.stack || []) {
    if (layer.route) {
      paths.push(layer.route.path);
      continue;
    }

    if (layer.name === "router" && layer.handle?.stack) {
      paths.push(...collectRoutePaths(layer.handle));
    }
  }

  return paths;
};

test("api router exposes the products routes", () => {
  const routes = collectRoutePaths(apiRouter);

  assert.ok(routes.includes("/:productId/recommended"), "expected the products recommendations route to be mounted");
});
