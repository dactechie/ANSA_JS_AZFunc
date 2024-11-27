const { flattenMatrix, joinStrings, joinObjects } = require("../flatteners");
const { buildTypesLists } = require("../utils");

describe('DrugsOfConcern Matrix Flattening', () => {
  const matrixMappings = {
    DrugsOfConcernDetails: {
      keyField: "DrugsOfConcern",
      valueFields: ["MethodOfUse", "DaysInLast28", "Units", "HowMuchPerOccasion", "Goals"]
    }
  };

  test('should flatten multiple drugs with all fields correctly', () => {
    const input = {
      DrugsOfConcernDetails: [
        {
          DrugsOfConcern: "Caffeine",
          MethodOfUse: "Ingest",
          DaysInLast28: "27",
          Units: "dosage (mls)",
          HowMuchPerOccasion: "30-39",
          Goals: "Cease Use"
        },
        {
          DrugsOfConcern: "Nicotine",
          MethodOfUse: "Smoke",
          DaysInLast28: "6",
          Units: "points",
          HowMuchPerOccasion: "80-99",
          Goals: "Maintain Abstinence"
        }
      ]
    };
  const result = flattenMatrix(input, ["DrugsOfConcernDetails"], matrixMappings);
  expect(result).toEqual({
    "DrugsOfConcernDetails_Caffeine_MethodOfUse": "Ingest",
    "DrugsOfConcernDetails_Caffeine_DaysInLast28": "27",
    "DrugsOfConcernDetails_Caffeine_Units": "dosage (mls)",
    "DrugsOfConcernDetails_Caffeine_HowMuchPerOccasion": "30-39",
    "DrugsOfConcernDetails_Caffeine_Goals": "Cease Use",
    "DrugsOfConcernDetails_Nicotine_MethodOfUse": "Smoke",
    "DrugsOfConcernDetails_Nicotine_DaysInLast28": "6",
    "DrugsOfConcernDetails_Nicotine_Units": "points",
    "DrugsOfConcernDetails_Nicotine_HowMuchPerOccasion": "80-99",
    "DrugsOfConcernDetails_Nicotine_Goals": "Maintain Abstinence"
  });
});

test('should handle empty DrugsOfConcernDetails array', () => {
  const input = { DrugsOfConcernDetails: [] };
  const result = flattenMatrix(input, ["DrugsOfConcernDetails"], matrixMappings);
  expect(result).toEqual({});
});

test('should handle long drug names correctly', () => {
  const input = {
    DrugsOfConcernDetails: [{
      DrugsOfConcern: "other Drug more than 30 charsdf adsf gggg",
      MethodOfUse: "Inhale (vapour)",
      DaysInLast28: "25",
      Units: "grams",
      HowMuchPerOccasion: "9",
      Goals: "Maintain Current Level of use"
    }]
  };

  const result = flattenMatrix(input, ["DrugsOfConcernDetails"], matrixMappings);
  expect(result).toEqual({
    "DrugsOfConcernDetails_otherDrugmorethan30charsdfadsfgggg_MethodOfUse": "Inhale (vapour)",
    "DrugsOfConcernDetails_otherDrugmorethan30charsdfadsfgggg_DaysInLast28": "25",
    "DrugsOfConcernDetails_otherDrugmorethan30charsdfadsfgggg_Units": "grams",
    "DrugsOfConcernDetails_otherDrugmorethan30charsdfadsfgggg_HowMuchPerOccasion": "9",
    "DrugsOfConcernDetails_otherDrugmorethan30charsdfadsfgggg_Goals": "Maintain Current Level of use"
  });
});

test('should handle missing optional fields', () => {
  const input = {
    DrugsOfConcernDetails: [{
      DrugsOfConcern: "Caffeine",
      MethodOfUse: "Ingest",
      DaysInLast28: "27"
    }]
  };

  const result = flattenMatrix(input, ["DrugsOfConcernDetails"], matrixMappings);
  expect(result).toEqual({
    "DrugsOfConcernDetails_Caffeine_MethodOfUse": "Ingest",
    "DrugsOfConcernDetails_Caffeine_DaysInLast28": "27",
    "DrugsOfConcernDetails_Caffeine_Units": "",
    "DrugsOfConcernDetails_Caffeine_HowMuchPerOccasion": "",
    "DrugsOfConcernDetails_Caffeine_Goals": ""
  });
});
});