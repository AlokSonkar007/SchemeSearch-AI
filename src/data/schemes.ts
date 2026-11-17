import type { Scheme } from "../types/scheme";

export const schemes: Scheme[] = [
  {
    id: "education-support",
    name: "Education Support Programme",
    category: "Education",
    description: "Illustrative financial assistance programme for students pursuing higher education.",
    benefit: "Education assistance — sample record",
    dataStatus: "prototype",
    sourceUrl: null,
    criteria: [
      {
        field: "age",
        operator: "max",
        value: 35,
        mandatory: true,
        weight: 15,
        label: "Age must be 35 years or below"
      },
      {
        field: "occupation",
        operator: "equals",
        value: "Student",
        mandatory: true,
        weight: 25,
        label: "Applicant must be a student"
      },
      {
        field: "primaryGoal",
        operator: "equals",
        value: "Education & Scholarships",
        mandatory: true,
        weight: 30,
        label: "Objective must be education"
      },
      {
        field: "annualIncome",
        operator: "max",
        value: 800000,
        mandatory: false,
        weight: 30,
        label: "Family income preference"
      }
    ]
  },
  {
    id: "entrepreneurship-support",
    name: "Entrepreneurship Support Programme",
    category: "Business",
    description: "Illustrative support programme for individuals planning to establish a business.",
    benefit: "Business assistance — sample record",
    dataStatus: "prototype",
    sourceUrl: null,
    criteria: [
      {
        field: "age",
        operator: "min",
        value: 18,
        mandatory: true,
        weight: 20,
        label: "Applicant must be at least 18"
      },
      {
        field: "occupation",
        operator: "oneOf",
        value: ["Business Owner", "Self-employed"],
        mandatory: true,
        weight: 30,
        label: "Applicant must be self-employed or a business owner"
      },
      {
        field: "primaryGoal",
        operator: "equals",
        value: "Business & Entrepreneurship",
        mandatory: true,
        weight: 30,
        label: "Objective must be entrepreneurship"
      },
      {
        field: "education",
        operator: "educationAtLeast",
        value: "10th pass",
        mandatory: false,
        weight: 20,
        label: "Educational qualification preference"
      }
    ]
  },
  {
    id: "agriculture-support",
    name: "Agriculture Development Programme",
    category: "Agriculture",
    description: "Illustrative assistance programme for individuals involved in agriculture.",
    benefit: "Agricultural assistance — sample record",
    dataStatus: "prototype",
    sourceUrl: null,
    criteria: [
      {
        field: "occupation",
        operator: "equals",
        value: "Farmer",
        mandatory: true,
        weight: 40,
        label: "Applicant must be a farmer"
      },
      {
        field: "primaryGoal",
        operator: "equals",
        value: "Agriculture",
        mandatory: true,
        weight: 35,
        label: "Objective must be agriculture"
      },
      {
        field: "residence",
        operator: "equals",
        value: "Rural",
        mandatory: false,
        weight: 25,
        label: "Rural residence preference"
      }
    ]
  },
  {
    id: "housing-support",
    name: "Housing Assistance Programme",
    category: "Housing",
    description: "Illustrative assistance programme for individuals seeking housing support.",
    benefit: "Housing assistance — sample record",
    dataStatus: "prototype",
    sourceUrl: null,
    criteria: [
      {
        field: "primaryGoal",
        operator: "equals",
        value: "Housing",
        mandatory: true,
        weight: 35,
        label: "Objective must be housing"
      },
      {
        field: "annualIncome",
        operator: "max",
        value: 600000,
        mandatory: true,
        weight: 35,
        label: "Family income must be within the sample limit"
      },
      {
        field: "residence",
        operator: "oneOf",
        value: ["Rural", "Urban"],
        mandatory: false,
        weight: 30,
        label: "Residential information"
      }
    ]
  },
  {
    id: "skill-development",
    name: "Skill Development Programme",
    category: "Employment",
    description: "Illustrative programme for individuals seeking skill development and employment opportunities.",
    benefit: "Training assistance — sample record",
    dataStatus: "prototype",
    sourceUrl: null,
    criteria: [
      {
        field: "age",
        operator: "min",
        value: 18,
        mandatory: true,
        weight: 25,
        label: "Applicant must be at least 18"
      },
      {
        field: "occupation",
        operator: "oneOf",
        value: ["Student", "Unemployed"],
        mandatory: true,
        weight: 30,
        label: "Applicant must be a student or unemployed"
      },
      {
        field: "primaryGoal",
        operator: "equals",
        value: "Employment & Skill Development",
        mandatory: true,
        weight: 35,
        label: "Objective must be employment or skill development"
      },
      {
        field: "education",
        operator: "educationAtLeast",
        value: "10th pass",
        mandatory: false,
        weight: 10,
        label: "Educational qualification preference"
      }
    ]
  }
];
