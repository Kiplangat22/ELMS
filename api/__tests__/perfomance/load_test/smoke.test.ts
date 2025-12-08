// ===== Simple Smoke Test =====
// File: smoke.test.ts
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1,
  duration: "1m",
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const res = http.get(`${BASE_URL}/getAllEmployees`);
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  sleep(1);
}