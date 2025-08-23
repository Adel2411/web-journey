import request from "supertest";
import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import app from "../src/app.js";

const BASE = "/api";

function randEmail() {
  const n = Math.floor(Math.random() * 1000000);
  return `testuser${n}@example.com`;
}

test("Auth + Notes API e2e flow", async () => {
  // health
  let res = await request(app).get("/");
  assert.equal(res.status, 200);
  assert.match(res.body?.message ?? "", /CollabNote API/i);

  // register
  const email = randEmail();
  const payload = {
    email,
    password: "TestPass123",
    confirmPassword: "TestPass123",
    name: "Tester",
    age: 22,
  };

  res = await request(app)
    .post(`${BASE}/auth/register`)
    .send(payload)
    .set("Content-Type", "application/json");
  assert.ok([200, 201].includes(res.status));
  assert.ok(res.body?.token, "token not returned from register");
  const token = res.body.token;
  const decoded = jwt.decode(token);
  assert.ok(decoded && typeof decoded === "object" && "userId" in decoded);

  // list notes (should be ok)
  res = await request(app)
    .get(`${BASE}/notes`)
    .set("Authorization", `Bearer ${token}`);
  assert.equal(res.status, 200);

  // create note
  res = await request(app)
    .post(`${BASE}/notes`)
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Test Note", content: "Hello from test", isPublic: true });
  assert.equal(res.status, 201);
  const noteId = res.body.id;
  assert.ok(noteId, "note id missing");

  // get note by id
  res = await request(app)
    .get(`${BASE}/notes/${noteId}`)
    .set("Authorization", `Bearer ${token}`);
  assert.equal(res.status, 200);

  // update note
  res = await request(app)
    .put(`${BASE}/notes/${noteId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Updated Title" });
  assert.equal(res.status, 200);

  // delete note
  res = await request(app)
    .delete(`${BASE}/notes/${noteId}`)
    .set("Authorization", `Bearer ${token}`);
  assert.ok([200, 204].includes(res.status));
});
