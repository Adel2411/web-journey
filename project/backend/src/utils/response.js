// Centralized response formatter to ensure consistent Response structure

export function ok(res, body = {}, status = 200) {
  return res.status(status).json({ success: true, ...body });
}

export function created(res, body = {}) {
  return ok(res, body, 201);
}

export function noContentOk(res, message = "Done") {
  // Prefer 200 with a body so clients always receive `success`
  return ok(res, { message }, 200);
}

export function fail(res, message = "Error", status = 500, code, extra = {}) {
  const payload = { success: false, message, ...extra };
  if (code) payload.code = code;
  return res.status(status).json(payload);
}
