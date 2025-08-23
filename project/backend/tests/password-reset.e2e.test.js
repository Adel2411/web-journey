import request from "supertest";
import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const BASE = "/api";

function randEmail() {
  const n = Math.floor(Math.random() * 1_000_000);
  return `resetuser${n}@example.com`;
}

async function registerUser(email) {
  const payload = {
    email,
    password: "OrigPass123",
    confirmPassword: "OrigPass123",
    name: "Reset Tester",
    age: 28,
  };
  const res = await request(app)
    .post(`${BASE}/auth/register`)
    .send(payload)
    .set("Content-Type", "application/json");
  assert.ok([200, 201].includes(res.status), `register failed ${res.status}`);
  return res.body;
}

test("Password reset flow: request token, reset, verify login works, token consumed", async () => {
  // Arrange
  const email = randEmail();
  await registerUser(email);

  // Request reset token
  let res = await request(app)
    .post(`${BASE}/auth/forgot-password`)
    .send({ email })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 200);
  // In dev we include token for convenience
  const token = res.body?.token;
  assert.ok(
    token && typeof token === "string" && token.length > 10,
    "reset token missing in response"
  );

  // Reset password using token
  const newPassword = "NewPass456";
  res = await request(app)
    .post(`${BASE}/auth/reset-password`)
    .send({ token, password: newPassword, confirmPassword: newPassword })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 200);
  assert.match(res.body?.message ?? "", /Password has been reset/i);

  // Old password should fail to login
  res = await request(app)
    .post(`${BASE}/auth/login`)
    .send({ email, password: "OrigPass123" })
    .set("Content-Type", "application/json");
  assert.ok(
    [400, 401].includes(res.status),
    `expected 400/401 when using old password, got ${res.status}`
  );

  // New password should login successfully
  res = await request(app)
    .post(`${BASE}/auth/login`)
    .send({ email, password: newPassword })
    .set("Content-Type", "application/json");
  assert.ok([200, 201].includes(res.status));
  assert.ok(res.body?.token, "login token missing after reset");

  // Token should be consumed: trying to reset again with same token should fail
  res = await request(app)
    .post(`${BASE}/auth/reset-password`)
    .send({
      token,
      password: "AnotherPass789",
      confirmPassword: "AnotherPass789",
    })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 400);
});
