# ANSA_JS_AZFunc

An Azure Function that flattens and transforms survey data into a standardized format.

## Def 
 push to azure/deploy : > func azure functionapp publish ansa-jsflattener-dev --verbose

## Features

- Transforms nested survey data structures into flattened key-value pairs
- Handles multiple data types:
  - Matrix data (nested objects with key-value fields)
  - String lists (arrays of strings)
  - Object arrays
- Provides lookup mapping for quantifiable values
- Adds checkmarks for checklist items
- Strips special characters from keys

## Usage

The function accepts HTTP POST requests with the following body structure:

```json
{
  "SurveyData": "...", 
  "SpreadUpAliasMap": {},
  "Exclusions": [],
  "MatrixMappings": {},
  "FullChecklists": {},
  "QuantifiableMappings": {}
}

## Input Parameters

### SpreadUpAliasMap

Maps nested objects to flattened key-value pairs:

```json
{
  "Past4WkEngagedInOtheractivities": "Engaged",
  "OtherAddictiveBehaviours": "OBehave"
}
```

## Example

### Input Paameters

#### SpreadUpAliasMap

Maps nested objects into flattened key-value pairs with custom prefixes.

```json
{
  "Past4WkEngagedInOtheractivities": "Engaged",
  "OtherAddictiveBehaviours": "OBehave"
}

// Input
{
  "Past4WkEngagedInOtheractivities": {
    "Paid Work": {
      "Frequency": "Three or four times per week",
      "Days": "17"
    }
  }
}

// Output
{
  "EngagedPaidWorkFrequency": "Three or four times per week",
  "EngagedPaidWorkDays": "17"
}
```

#### MatrixMappings

Flattens matrix-like data structures with specified key and value fields.

```json
{
  "AODRisk": {
    "keyField": "AODRiskDetail",
    "valueFields": ["Days"]
  }
}

// Input
{
  "AODRisk": [
    { "AODRiskDetail": "Polydrug Use", "Days": "14" },
    { "AODRiskDetail": "Driving Intoxicated" }
  ]
}

// Output
{
  "AODRisk_PolydrugUse_Days": "14",
  "AODRisk_DrivingIntoxicated_Days": null
}
```

#### QuantifiableMappings

Maps string values to numeric scores using predefined lookup tables.

```json
{
  "Past4WkDailyLivingImpacted": "NotAtAll_Daily"
}

// Input
{
  "Past4WkDailyLivingImpacted": "Three or four times per week"
}

// Output
{
  "Past4WkDailyLivingImpacted": 3
}
```

#### FullChecklists

Converts arrays into individual yes/no fields.

```json
{
  "RiskAssessmentChecklist": [
    "Suicide Risk",
    "Self Harm",
    "Harm to Others"
  ]
}

// Input
{
  "RiskAssessmentChecklist": ["Suicide Risk", "Harm to Others"]
}

// Output
{
  "RiskAssessmentChecklist": {
    "Suicide Risk": "y",
    "Self Harm": " ",
    "Harm to Others": "y"
  }
}
```

#### Exclusions

Array of field names to exclude from processing:

```json
{
  "Exclusions": ["RiskAssessmentChecklist", "FinalChecklist"]
}
```
