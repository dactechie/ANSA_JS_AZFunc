const { buildTypesLists } = require("./utils");
const {
  spreadUpIntoArray,
  joinStrings,
  riskAssessmentTimeSpent
} = require("./flatteners");

function transform(surveyData, typesLists, exclusions) {
  const { listOfStringLists, objectOfObjectTypeKeys } = typesLists;
  // 0: "PDC"
  // 1: "OtherAddictiveBehaviours"
  // 2: "Past4WkEngagedInOtheractivities"
  // 3: "HowDoYouSpendTime"
  // 4: "RiskAssessmentCheck"

  const joinedLists = joinStrings(surveyData, listOfStringLists, exclusions);

  let sData = {
    ...surveyData,
    ...surveyData["PDC"][0],
    ...spreadUpIntoArray(surveyData),
    ...joinedLists,
    ...riskAssessmentTimeSpent(surveyData)
  };

  delete sData["PDC"];

  return sData;
}

module.exports = async function (context, req) {
  // function app : ansa-jsflattener
  context.log(
    "JavaScript HTTP " +
      req.body.SurveyData +
      "trigger function processed a request."
  );

  const exclusions = req.body.Exclusions; //["FinalChecklist"]
  const surveyData = JSON.parse(req.body.SurveyData);
  const typesLists = buildTypesLists(surveyData);

  const transformedSurveyData = transform(surveyData, typesLists, exclusions);

  // const {
  //   objectArrayTypeKeys,
  //   objectOfObjectTypeKeys,
  //   objectOfStringsTypeKeys
  // } = buildTable(transformedSurveyData);

  const responseMessage = transformedSurveyData;
  //JSON.stringify(
  // {
  //   arrays: objectArrayTypeKeys,
  //   objs: objectOfObjectTypeKeys,
  //   strings: objectOfStringsTypeKeys
  // };
  //)

  // name
  //     ? "Hello, " + name + ". This HTTP triggered function executed successfully."
  //     : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage
  };
};
