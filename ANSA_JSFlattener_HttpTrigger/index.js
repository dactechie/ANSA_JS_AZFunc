const { buildTypesLists } = require("./utils");
const {
  spreadUpIntoArray,
  joinStrings,
  areaRank
} = require("./flatteners");

function transform(surveyData, typesLists, spreadUpAliasMap, exclusions) {

  const { listOfStringLists, rankedObjectOfObjectTypeKeys } = typesLists;
  // listOfStringLists: HealthChecklist_STAFF, MHRecentRiskIssues, MHHistoricalRiskIssues
  // rankedObjectOfObjectTypeKeys : 3: "HowDoYouSpendTime"
  // 4: "RiskAssessmentCheck"
  const joinedLists = joinStrings(surveyData, listOfStringLists, exclusions);
  let sData = {
    ...surveyData,
    ...surveyData["PDC"][0],
    //   // 1: "OtherAddictiveBehaviours"   2: "Past4WkEngagedInOtheractivities"
    ...spreadUpIntoArray(surveyData, spreadUpAliasMap),
    ...joinedLists, // HealthChecklist_STAFF, MHRecentRiskIssues
    ...areaRank(surveyData, rankedObjectOfObjectTypeKeys) //"HowDoYouSpendTime")
  };

  ["PDC", ...Object.keys(spreadUpAliasMap) ].forEach( e => delete sData[e]);

  return sData;
}

/* *
 * function app : ansa-jsflattener
 */
module.exports = async function (context, req) {
  context.log(
    "JavaScript HTTP " +
      req.body.SurveyData +
      "trigger function processed a request."
  );

  const surveyData = JSON.parse(req.body.SurveyData);
  const typesLists = buildTypesLists(surveyData);

  const transformedSurveyData = transform(surveyData, typesLists, req.body.SpreadUpAliasMap, req.body.Exclusions);

  // const {
  //   objectArrayTypeKeys,
  //   objectOfObjectTypeKeys,
  //   objectOfStringsTypeKeys
  // } = buildTable(transformedSurveyData);

  const responseMessage = transformedSurveyData;


  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage
  };
};
