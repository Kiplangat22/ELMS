// ===== Spike Test =====
// File: spike.test.ts
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },   // Normal load
    { duration: "30s", target: 500 },  // Sudden spike
    { duration: "1m", target: 500 },   // Stay at spike
    { duration: "10s", target: 10 },   // Return to normal
    { duration: "1m", target: 10 },    // Stay at normal
    { duration: "10s", target: 0 },    // Ramp down
  ],
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const res = http.get(`${BASE_URL}/getAllEmployees`);
  check(res, {
    "status is 200": (r) => r.status === 200,
  });
  sleep(1);
}