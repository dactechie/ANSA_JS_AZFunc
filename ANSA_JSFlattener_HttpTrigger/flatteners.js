function a() {
  var body = workflowContext.actions.Parse_CommonJSON.outputs.body;
  var risk_chklist = "";
  if (body["RiskAssessmentCheck"])
    risk_chklist = Object.entries(body["RiskAssessmentCheck"])
      .map((e) => {
        if (e[1]["NoYes"]) return e[0];
      })
      .filter((f) => f)
      .join(", ");
  var timeSpent = [];
  if (body["HowDoYouSpendTime"])
    timeSpent = Object.entries(body["HowDoYouSpendTime"]).map((e) => {
      let a = {};
      a["area"] = e[0];
      a["rank"] = e[1]["Rank Importance to You (in terms of time spent)"];
      return a;
    });
  var sortedTimeSpent = timeSpent.sort((a, b) =>
    a.rank > b.rank ? 1 : b.rank > a.rank ? -1 : 0
  );
  return {
    RiskAssessmentCheck: risk_chklist,
    SortedTimeSpent: sortedTimeSpent
      .map((e) => `${e["area"]}(${e["rank"]})`)
      .join(",  ")
  };
}

function b() {
  var body = workflowContext.actions.Parse_CommonJSON.outputs.body;
  function chkList(list) {
    if (!list) return "";
    return list.join(", ");
  }
  var oab = [];
  if (body["OtherAddictiveBehaviours"])
    Object.entries(body["OtherAddictiveBehaviours"]).forEach((k) =>
      oab.push({ oBehave: k[0], Days: k[1]["Days"] })
    );
  return {
    OtherAddictiveBehaviours: oab,
    SupportTypeBestMatchesNeedsGoals: chkList(
      body["SupportTypeBestMatchesNeedsGoals"]
    ),
    PrimaryCaregiver: chkList(body["PrimaryCaregiver"]),
    MHRecentRiskIssues: chkList(body["MHRecentRiskIssues"]),
    MHHistoricalRiskIssues: chkList(body["MHHistoricalRiskIssues"])
  };
}

function c() {
  var body = workflowContext.actions.Parse_CommonJSON.outputs.body;
  function chkList2(listName) {
    if (!body[listName]) return "";
    return body[listName].join(", ");
  }
  var pdc = body["PDC"][0];

  return {
    SupportFromWhichOtherServices2: chkList2("SupportFromWhichOtherServices"),
    PDCSubstanceOrGambling: pdc["PDCSubstanceOrGambling"],
    PDCAgeFirstUsed: pdc["PDCAgeFirstUsed"],
    PDCAgeLastUsed: pdc["PDCAgeLastUsed"],
    PDCDaysInLast28: pdc["PDCDaysInLast28"],
    PDCUnits: pdc["PDCUnits"],
    PDCGoals: pdc["PDCGoals"],
    PDCHowMuchPerOccasion: pdc["PDCHowMuchPerOccasion"],
    HealthChecklist_STAFF: chkList2(body["HealthChecklist_STAFF"])
  };
}

function d() {
  var body = workflowContext.actions.Parse_CommonJSON.outputs.body;
  var otheractivities = "";
  if (body["Past4WkEngagedInOtheractivities"])
    otheractivities = Object.entries(body["Past4WkEngagedInOtheractivities"])
      .map((e) => {
        return { EngType: e[0], Freq: e[1]["Frequency"], Days: e[1]["Days"] };
      })
      .filter((e) => e);

  return otheractivities;
}
