// This file contains Joe's LinkedIn data to initialize the user profile
// Run this after creating the database to populate Joe's profile

export const JOE_LINKEDIN_DATA = {
  name: "Joe Bishop",
  title: "Purchasing Manager",
  company: "Toyota Motor Corporation",
  location: "Union, Kentucky, United States",
  connections: 292,
  experience: [
    {
      title: "Purchasing Manager",
      company: "Toyota Motor Corporation",
      duration: "Jul 2022 - Present · 3 yrs 5 mos",
      location: "Georgetown, Kentucky, United States",
    },
    {
      title: "Purchasing Specialist",
      company: "Toyota Motor Engineering & Manufacturing North America (TEMA)",
      duration: "Feb 1999 - Present · 26 yrs 10 mos",
      location: "Erlanger, Kentucky",
    },
    {
      title: "Purchasing Manager",
      company: "Newell Rubbermaid",
      duration: "Feb 1995 - Jan 1999 · 4 yrs",
      location: "Maryville, TN",
    },
    {
      title: "Purchasing Supervisor",
      company: "O'Sullivan Corporation",
      duration: "Oct 1992 - Jan 1995 · 2 yrs 4 mos",
      location: "Winchester, VA",
    },
    {
      title: "Senior Buyer",
      company: "Atlantic Research Corporation",
      duration: "Nov 1989 - Sep 1992 · 2 yrs 11 mos",
      location: "Gainesville, VA",
    },
  ],
  education: [
    {
      school: "Georgetown College",
      degree: "Bachelor's Degree, Business Administration",
    },
  ],
  certifications: [
    {
      name: "Certified Purchasing Manager (C.P.M.)",
      issuer: "Institute for Supply Management, Inc.",
    },
  ],
  skills: ["Procurement", "Purchasing"],
};

// SQL to initialize:
/*
INSERT INTO user_profile (id, linkedin_data, created_at, updated_at)
VALUES (
  'joe_bishop',
  '{"name":"Joe Bishop","title":"Purchasing Manager",...}',
  ${Date.now()},
  ${Date.now()}
);
*/
