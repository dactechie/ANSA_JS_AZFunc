const { buildTypesLists, addCheckMark, mapQuantifiables } = require("./utils");
const { spreadUpIntoArray, joinStrings, joinObjects } = require("./flatteners");

function transformStructure(
  surveyData,
  typesLists,
  spreadUpAliasMap,
  exclusions
) {
  const { listOfStringLists, objectArrayTypeKeys } = typesLists;
  // listOfStringLists: HealthChecklist_STAFF, MHRecentRiskIssues, MHHistoricalRiskIssues
  // 4: "RiskAssessmentCheck"
  let sData = {
    ...surveyData,
    ...spreadUpIntoArray(surveyData, spreadUpAliasMap),
    ...joinStrings(surveyData, listOfStringLists, exclusions), // HealthChecklist_STAFF, MHRecentRiskIssues};
    ...joinObjects(surveyData, objectArrayTypeKeys, exclusions)
  };
  if (sData["PDC"]) {
    sData = { ...sData["PDC"][0], ...sData };
    delete sData["PDC"];
  }
  // objectArrayTypeKeys.forEach(k => delete sData[k]); // Don't delete ODC, need it in the structured form for the Table.
  [...Object.keys(spreadUpAliasMap)].forEach(e => delete sData[e]);
  return sData;
}

function transformFormatting(surveyData, fullCheckLists, quantifiableMappings) {
  // "FullCheckLists": {
  //   "FinalChecklist":
  //         ["Risk Assessments Completed (if indicated)", ...],
  //   "RiskAssessmentCheckist": [
  //         "Any indication of mental health risks?","Any indication of suicidal ideation?",..
  // }
  if (!fullCheckLists) return surveyData;

  const moddedChecklists = addCheckMark(surveyData, fullCheckLists);
  const mappedQuantifiables = mapQuantifiables(
    surveyData,
    quantifiableMappings
  );

  return { ...surveyData, ...moddedChecklists, ...mappedQuantifiables };
}

/* *
 * function app : ansa-jsflattener
 */
module.exports = async function (context, req) {
  const surveyData = JSON.parse(req.body.SurveyData);
  const typesLists = buildTypesLists(surveyData);

  const moddedStructSurveyData = transformStructure(
    surveyData,
    typesLists,
    req.body.SpreadUpAliasMap,
    req.body.Exclusions
  );

  const finalSurveyData = transformFormatting(
    moddedStructSurveyData,
    req.body.FullChecklists,
    req.body.QuantifiableMappings
  );
  context.log(
    "JavaScript HTTP output :  " +
      JSON.stringify(finalSurveyData) +
      "trigger function processed a request."
  );
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: finalSurveyData
  };
};
