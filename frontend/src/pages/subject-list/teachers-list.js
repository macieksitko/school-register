import React from "react";

export default function TeachersList({ cells, teachers }) {
  const values =
    cells.length !== 0 && teachers
      ? cells.map((teacherId) => teachers.find(({ _id }) => _id === teacherId)?.description)
      : "-";

  if (values !== "-") {
    return (
      <ul style={{ margin: 0, paddingLeft: 15 }}>
        {values.map((x) => (
          <li>{x}</li>
        ))}
      </ul>
    );
  }

  return "No teacher assigned.";
}
