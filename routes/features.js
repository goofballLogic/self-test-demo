const express = require("express");
const dispatch = require("./feature-dispatch");
const { default: gherkin } = require("gherkin");
const fs = require("fs");
const path = require("path");
const cucumberExpressions = require("cucumber-expressions");

const router = express.Router();
const ceg = new cucumberExpressions.CucumberExpressionGenerator(new cucumberExpressions.ParameterTypeRegistry());

const options = {
  includeSource: true,
  includeGherkinDocument: true,
  includePickles: true,
};

const featuresFolder = path.resolve(__dirname, "../features");

router.get(
  "/",
  async (_, res) => res.type("application/json").send(await features())
);

router.post(
  "/run-step",
  async (req, res) => {
    req.testContextId = req.testContextId || Date.now().toString();
    res.cookie("test-context", req.testContextId, { maxAge: 120000, httpOnly: true });
    res.type("application/json").send(await runStep(req));
  }
);

async function features() {

  const featurePaths = fs.readdirSync(featuresFolder).map(file => path.resolve(featuresFolder, file));
  const fromPaths = gherkin.fromPaths(featurePaths, options);
  const consumed = [];
  for await (let item of fromPaths) {
    const jObject = JSON.parse(JSON.stringify(item));
    consumed.push(jObject);
    if (jObject.pickle) {
      jObject.pickle.steps.forEach(step => {
        step.expr = ceg.generateExpressions(step.text);
      });
    }
  }
  return JSON.stringify(consumed);

}

async function runStep(req) {
  try {
    const { description, context, params } = req.body;
    context.testContextId = req.testContextId;
    console.log("RUN STEP", context.testContextId);
    const outcome = dispatch(description, context, params);
    return JSON.stringify({
      outcome,
      context
    });
  } catch (err) {
    return JSON.stringify({
      error: err.stack
    });
  }
}

module.exports = router;