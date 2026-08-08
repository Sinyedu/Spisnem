// Runs the backend and frontend dev servers together, with prefixed output.
// Deliberately dependency-free so the repo root needs no install or lockfile.
// pretty cool for testing to be honest, but not a replacement for a proper monorepo tool like Turborepo or Nx could be better not sure. We can research this?
import { spawn } from "node:child_process";
import { createInterface } from "node:readline";

const targets = [
  ["backend", "restaurant-backend"],
  ["frontend", "restaurant-frontend"],
];

let stopping = false;

const children = targets.map(([name, dir]) => {
  const child = spawn("pnpm", ["--dir", dir, "run", "dev"], {
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
  });

  for (const stream of [child.stdout, child.stderr]) {
    createInterface({ input: stream }).on("line", (line) => console.log(`[${name}] ${line}`));
  }

  child.on("exit", (code) => {
    if (!stopping) console.log(`[${name}] exited with code ${code}`);
    shutdown(code ?? 1);
  });

  return child;
});

// If one server dies, stop the other rather than leaving half the stack running.
function shutdown(code) {
  if (stopping) return;
  stopping = true;

  for (const child of children) {
    if (child.exitCode !== null) continue;
    if (process.platform === "win32") {
      // The shell is the direct child, so kill the whole tree or vite/tsx is orphaned.
      spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } else {
      child.kill("SIGTERM");
    }
  }

  process.exitCode = code;
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => shutdown(0));
}
