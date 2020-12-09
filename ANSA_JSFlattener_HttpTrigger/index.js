const { buildTypesLists, addCheckMark } = require("./utils");
const {
  spreadUpIntoArray,
  joinStrings,
  areaRank
} = require("./flatteners");

function transformStructure(surveyData, typesLists, spreadUpAliasMap, exclusions) {

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

function transformFormatting(surveyData, fullCheckLists) {
  // "FullCheckLists": {
  //   "FinalChecklist": 
  //         ["Risk Assessments Completed (if indicated)", ...],
  //   "RiskAssessmentCheckist": [
  //         "Any indication of mental health risks?","Any indication of suicidal ideation?",..
  // }
  if( !fullCheckLists) return surveyData;

  const moddedChecklists = addCheckMark(
                            surveyData
                            , fullCheckLists);
 
  return {...surveyData,...moddedChecklists};
}

/* *
 * function app : ansa-jsflattener
 */
module.exports = async function (context, req) {


  
  const surveyData = JSON.parse(req.body.SurveyData);
  const typesLists = buildTypesLists(surveyData);

  const moddedStructSurveyData = transformStructure(
                                    surveyData
                                    , typesLists
                                    , req.body.SpreadUpAliasMap
                                    , req.body.Exclusions);
  
  const finalSurveyData = transformFormatting(
                              moddedStructSurveyData
                              , req.body.FullChecklists);
      context.log(
        "JavaScript HTTP output :  " +
        JSON.stringify(finalSurveyData )+
          "trigger function processed a request."
      );
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: finalSurveyData
  };
};
