function e0e1(dict, e0Key) {
  if (!dict) return [];

  return Object.entries(dict)
    .map(e => {
      return { [e0Key]: e[0], ...e[1] };
    })
    .filter(e => e);
}
// objectOfObjectTypeKeys: (5) ["PDC", "OtherAddictiveBehaviours", "Past4WkEngagedInOtheractivities", "HowDoYouSpendTime", "RiskAssessmentCheck"]
function riskAssessmentTimeSpent(body) {
  // RiskAssessmentCheck:
  //   IndicationOfDomesticFamViolence:
  //     NoYes: true
  //   IndicationOfMHRisks:
  //     NoYes: false
  let risk_chklist = "";
  if (body["RiskAssessmentCheck"])
    risk_chklist = Object.entries(body["RiskAssessmentCheck"])
      .map(e => {
        if (e[1]["NoYes"]) return e[0];
      })
      .filter(f => f)
      .join(", ");

  let timeSpent = [];
  if (body["HowDoYouSpendTime"])
    timeSpent = e0e1(body["HowDoYouSpendTime"], "area");

  const sortedTimeSpent = timeSpent.sort((a, b) =>
    a.Rank > b.Rank ? 1 : b.Rank > a.Rank ? -1 : 0
  );

  return {
    RiskAssessmentCheck: risk_chklist,
    HowDoYouSpendTime: sortedTimeSpent
      .map(e => `${e["area"]}(${e["Rank"]})`)
      .join(",  ")
  };
}

function joinStrings(body, listOfStringListNames = [], exclusions = []) {
  let dict = {};
  if (exclusions)
    listOfStringListNames = listOfStringListNames.filter(
      e => !exclusions.includes(e)
    );

  listOfStringListNames.forEach(eStrListName => {
    if (!body[eStrListName]) return "";
    dict[eStrListName] = body[eStrListName].join(", ");
  });
  return dict;
}

// OtherAddictiveBehaviours e0e1(body,"OtherAddictiveBehaviours",  "OBehave")
function spreadUpIntoArray(body) {
  return {
    OtherAddictiveBehaviours: e0e1(body["OtherAddictiveBehaviours"], "OBehave"),
    //  0: {EngType: "Paid Work",  Frequency: 5, Days: "4"}
    Past4WkEngagedInOtheractivities: e0e1(
      body["Past4WkEngagedInOtheractivities"],
      "EngType"
    )
  };
}
/* INPUT :
    Past4WkEngagedInOtheractivities:
      Looking after children:
        Days: "15"

      Other caregiving activities:
        Frequency: 2

      Paid Work:
        Days: "4"
        Frequency: 5
    
    // FUNCTION:  e0e1(body,"Past4WkEngagedInOtheractivities",  "EngType")
    // RESULT  :
    [
      0: {EngType: "Paid Work",  Frequency: 5, Days: "4"}
      1: {EngType: "Study - college, school or vocational education", Frequency: 3, Days: "13"}
      2: {EngType: "Voluntary Work", Frequency: 2, Days: "7"}
    ] 

    */
module.exports = { spreadUpIntoArray, joinStrings, riskAssessmentTimeSpent };
