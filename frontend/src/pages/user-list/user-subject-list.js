import React from "react";

export default function UserSubjectList({ cells }) {
  const subjects = cells.length !== 0 ? cells.map((x) => x.name) : "-";

  if (subjects !== "-") {
    return (
      <ul style={{ margin: 0, paddingLeft: 15 }}>
        {subjects.map((subject) => (
          <li>{subject}</li>
        ))}
      </ul>
    );
  }

  return "No subject assigned.";
}
