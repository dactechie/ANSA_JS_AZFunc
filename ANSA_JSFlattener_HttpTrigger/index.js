const { buildTypesLists, addCheckMark } = require("./utils");
const {
  spreadUpIntoArray,
  joinStrings
} = require("./flatteners");

function transformStructure(surveyData, typesLists, spreadUpAliasMap, exclusions) {

  const { listOfStringLists } = typesLists;
  // listOfStringLists: HealthChecklist_STAFF, MHRecentRiskIssues, MHHistoricalRiskIssues
  // 4: "RiskAssessmentCheck"
  let sData = {...surveyData 
              ,...spreadUpIntoArray(surveyData, spreadUpAliasMap)
              ,...joinStrings(surveyData, listOfStringLists, exclusions) // HealthChecklist_STAFF, MHRecentRiskIssues};
              };
  if(sData["PDC"]) {
    sData = { ...sData["PDC"][0],  ...sData  };
    delete sData["PDC"];
  }
  [...Object.keys(spreadUpAliasMap) ].forEach( e => delete sData[e]);
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
