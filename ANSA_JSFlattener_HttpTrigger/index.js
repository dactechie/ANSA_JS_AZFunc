const { buildTypesLists, addCheckMark, mapQuantifiables } = require("./utils");
const { spreadUpIntoArray, joinStrings,joinObjects, flattenMatrix } = require("./flatteners");

function transformStructure(
  surveyData,
  typesLists,
  spreadUpAliasMap,
  exclusions,
  matrixMappings
) {
  const { listOfStringLists, objectArrayTypeKeys, matrixTypeKeys } = typesLists;
  
  let sData = {
    ...surveyData,
    ...spreadUpIntoArray(surveyData, spreadUpAliasMap),
    ...joinStrings(surveyData, listOfStringLists, exclusions),
    ...joinObjects(surveyData, objectArrayTypeKeys, exclusions),
    ...flattenMatrix(surveyData, matrixTypeKeys, matrixMappings)
  };

  if (sData["PDC"]) {
    sData = { ...sData["PDC"][0], ...sData };
    delete sData["PDC"];
  }
  [...Object.keys(spreadUpAliasMap)].forEach(e => delete sData[e]);
  return sData;
}

function transformFormatting(surveyData, fullCheckLists, quantifiableMappings) {
  if (!fullCheckLists) return surveyData;

  const moddedChecklists = addCheckMark(surveyData, fullCheckLists);
  const mappedQuantifiables = mapQuantifiables(
    surveyData,
    quantifiableMappings
  );

  return { ...surveyData, ...moddedChecklists, ...mappedQuantifiables };
}

module.exports = async function (context, req) {
  const surveyData = JSON.parse(req.body.SurveyData);
  const typesLists = buildTypesLists(surveyData);

  const moddedStructSurveyData = transformStructure(
    surveyData,
    typesLists,
    req.body.SpreadUpAliasMap,
    req.body.Exclusions,
    req.body.MatrixMappings
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
    body: finalSurveyData
  };
};
