import request from "supertest";
import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/app.js";

const BASE = "/api";

function randEmail() {
  const n = Math.floor(Math.random() * 1_000_000);
  return `refuser${n}@example.com`;
}

test("Refresh token flow: login -> refresh -> access -> logout -> refresh fails", async () => {
  const email = randEmail();
  const register = await request(app)
    .post(`${BASE}/auth/register`)
    .send({
      email,
      password: "Pass12345",
      confirmPassword: "Pass12345",
      name: "Ref",
      age: 20,
    })
    .set("Content-Type", "application/json");
  assert.ok([200, 201].includes(register.status));
  assert.ok(register.body?.token);
  assert.ok(register.body?.refreshToken);

  const refreshToken = register.body.refreshToken;

  // Use refresh endpoint to rotate and get new access token
  let res = await request(app)
    .post(`${BASE}/auth/refresh`)
    .send({ refreshToken })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 200);
  assert.ok(res.body?.token);
  const newAccess = res.body.token;
  const newRefresh = res.body.refreshToken;
  assert.ok(
    newRefresh && newRefresh !== refreshToken,
    "refresh token should rotate"
  );

  // Access a protected endpoint with new access token
  res = await request(app)
    .get(`${BASE}/notes`)
    .set("Authorization", `Bearer ${newAccess}`);
  assert.equal(res.status, 200);

  // Logout (revoke current refresh token)
  res = await request(app)
    .post(`${BASE}/auth/logout`)
    .send({ refreshToken: newRefresh })
    .set("Content-Type", "application/json");
  assert.ok([200, 204].includes(res.status));

  // Attempt to refresh again with revoked token should fail
  res = await request(app)
    .post(`${BASE}/auth/refresh`)
    .send({ refreshToken: newRefresh })
    .set("Content-Type", "application/json");
  assert.equal(res.status, 401);
});
