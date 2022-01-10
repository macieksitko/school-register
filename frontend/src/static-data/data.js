export const grades = [
  {
    ID: 1,
    subject: "Biology",
    term1Grades: [
      {
        grade: 5,
        // reszte informacji o ocenie można wyświetlać w tooltipie, ale nwm czy nam to potrzebne
        // można dorzucić jeszcze nauczyciela, kategorie, czyliczyćdośredniej
        weight: 3,
        comment: "comment about grade?",
        date: "1964/03/16",
        teacher: "Adam Małysz",
      },
      {
        grade: 4.5,
        weight: 1,
        comment: "commenddt about grade?",
        date: "1968/03/16",
        teacher: "Adam Małysz",
      },
    ],
    term2Grades: [
      {
        grade: 5,
        weight: 2,
        comment: "comment about grade?",
        date: "1968/03/16",
        teacher: "Adam Małysz",
      },
    ],
    term1Grade: 5,
    term1Avg: 4.78,
    term2Grade: 5,
    term2Avg: 5,
    finalAvg: 4.7,
    finalGrade: 5,
  },
  {
    ID: 2,
    subject: "Math",
    term1Grades: [
      {
        grade: 4,
        weight: 3,
        comment: "comment about grade?",
        date: "1964/03/16",
        teacher: "Adam Małysz",
        // tutaj można dorzucić jeszcze autora, kategorie, datę, czy liczyć do średniej
      },
      {
        grade: 5,
        weight: 2,
        comment: "comment about grade?",
        date: "1968/03/16",
        teacher: "Adam Małysz",
      },
      {
        grade: 3.75,
        weight: 2,
        comment: "comment about grade?",
        date: "1968/03/16",
        teacher: "Adam Małysz",
      },
      {
        grade: "np",
        weight: null,
        comment: "comment about grade?",
        date: "1968/03/16",
        teacher: "Adam Małysz",
      },
    ],
    term2Grades: [],
    term1Grade: 4,
    term1Avg: 4.28,
    term2Grade: 4.5,
    term2Avg: 4.35,
    finalAvg: 4.2,
    finalGrade: 5,
  },
];

export const courses = [
  { id: 1, name: "Klasa 3A 2016/2017", isArchived: false },
  { id: 2, name: "Klasa 2B 2016/2017", isArchived: false },
  { id: 3, name: "Klasa 2A 2015/2016", isArchived: true },
];

export const subjects = [
  {
    id: 1,
    courseId: 1,
    name: "Biologia",
    teacher: "Adam Małysz",
  },
  {
    id: 2,
    courseId: 1,
    name: "WF",
    teacher: "Jane Ahonnen",
  },
  {
    id: 3,
    courseId: 2,
    name: "Matematyka",
    teacher: "Piotr Żyła",
  },
  {
    id: 4,
    courseId: 1,
    name: "Chemia",
    teacher: "Adam Małysz",
  },
];

export const students = [
  {
    id: 1,
    name: "Jerzy Kiler",
  },
  {
    id: 2,
    name: "Stefan Siarzewski",
  },
  {
    id: 3,
    name: "Ferdynand Lipski",
  },
  {
    id: 4,
    name: "Jerzy Ryba",
  },
];
