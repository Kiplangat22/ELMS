// ===== Soak Test (Breakpoint Soak) =====
// File: soak.test.ts
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "5m", target: 50 },   // Ramp up
    { duration: "4h", target: 50 },   // Stay for 4 hours
    { duration: "5m", target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<600"],
    http_req_failed: ["rate<0.05"],
  },
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const res = http.get(`${BASE_URL}/getAllEmployees`);
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}