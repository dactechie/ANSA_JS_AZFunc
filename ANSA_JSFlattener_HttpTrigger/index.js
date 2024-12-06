const { buildTypesLists, addCheckMark, mapQuantifiables } = require("./utils");
const { spreadUpIntoArray, joinStrings,joinObjects, flattenMatrix } = require("./flatteners");

function transformStructure(
  surveyData,
  typesLists,
  spreadUpAliasMap,
  exclusions,
  matrixMappings,
  allowedLists //full checklists
) {
  const { listOfStringLists, objectArrayTypeKeys, matrixTypeKeys } = typesLists;
  
  // matrix->AODRisksChecked has sibling list of items "AODRisksCheckedItems"
  const filteredLists = listOfStringLists.filter(listName =>   {
   
    const keyType=  matrixTypeKeys.find(matrixKey => listName === matrixKey + 'Items');
    if (!keyType) return;

    surveyData[listName] //AODRisksChecked
   
});

  let sData = {
    ...surveyData,
    ...spreadUpIntoArray(surveyData, spreadUpAliasMap),
    ...joinStrings(surveyData, listOfStringLists, exclusions),
    ...joinObjects(surveyData, objectArrayTypeKeys, exclusions),
    ...flattenMatrix(surveyData, matrixTypeKeys, matrixMappings, filteredLists)
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

/**
 * 
 * @param {*} context 
 * @param {*} req 
 */

module.exports = async function (context, req) {
  const surveyData = JSON.parse(req.body.SurveyData);
  const typesLists = buildTypesLists(surveyData);
  const maxLenOfItemText = req.body.maxLenOfMatrixItemText

  const moddedStructSurveyData = transformStructure(
    surveyData,
    typesLists,
    req.body.SpreadUpAliasMap,
    req.body.Exclusions,
    req.body.MatrixMappings,
    req.body.FullChecklists
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
