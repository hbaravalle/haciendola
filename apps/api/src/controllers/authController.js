import * as response from "../network/response.js";
import * as authService from "../services/authService.js";

function answerError(req, res, err) {
  if (err instanceof authService.AuthError) {
    if (err.extra.retryAfter) res.set("Retry-After", String(err.extra.retryAfter));
    return response.error(req, res, err.message, err.status);
  }
  console.error(err);
  return response.error(req, res);
}

async function requestCode(req, res) {
  try {
    await authService.requestCode(req.body.email);
    return response.success(req, res, "Code sent", 200);
  } catch (err) {
    return answerError(req, res, err);
  }
}

async function verifyCode(req, res) {
  try {
    const session = await authService.verifyCode(req.body.email, req.body.otp);
    return response.success(req, res, session, 200);
  } catch (err) {
    return answerError(req, res, err);
  }
}

async function startDemo(req, res) {
  try {
    const session = await authService.startDemoSession();
    return response.success(req, res, session, 200);
  } catch (err) {
    return answerError(req, res, err);
  }
}

export { requestCode, verifyCode, startDemo };
