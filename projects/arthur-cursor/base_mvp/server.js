import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { randomProblem } from "./lib/problems.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "pythagoras.sid",
    secret: process.env.SESSION_SECRET || "dev-only-change-in-production",
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 4 },
  })
);

function ensureProblem(req) {
  if (!req.session.problem) {
    req.session.problem = randomProblem();
  }
  return req.session.problem;
}

function newProblem(req) {
  req.session.problem = randomProblem();
  return req.session.problem;
}

app.get("/", (req, res) => {
  if (req.query.help === "1") req.session.showHelp = true;
  if (req.query.help === "0") req.session.showHelp = false;

  if (req.query.new === "1") {
    newProblem(req);
    req.session.feedback = null;
  } else if (!req.session.problem) {
    ensureProblem(req);
  }

  const feedback = req.session.feedback;
  req.session.feedback = null;

  const streak = req.session.streak ?? 0;
  res.render("index", {
    prompt: req.session.problem.prompt,
    feedback,
    streak,
    showFormula: !!req.session.showHelp,
  });
});

app.post("/check", (req, res) => {
  const problem = ensureProblem(req);
  const raw = String(req.body.answer ?? "").trim();
  const parsed = parseFloat(raw.replace(",", "."));

  if (Number.isNaN(parsed)) {
    req.session.feedback = {
      ok: false,
      message: "Enter a number (e.g. 5 or 12.5).",
    };
    return res.redirect("/");
  }

  const correct = problem.answer;
  const ok = Math.abs(parsed - correct) < 1e-6;

  if (ok) {
    req.session.streak = (req.session.streak ?? 0) + 1;
    req.session.feedback = {
      ok: true,
      message: `Correct! ${correct} is right.`,
    };
    newProblem(req);
  } else {
    req.session.streak = 0;
    req.session.feedback = {
      ok: false,
      message: `Not quite — try again! (You entered ${parsed}.)`,
    };
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Pythagoras Practice at http://localhost:${PORT}`);
});
