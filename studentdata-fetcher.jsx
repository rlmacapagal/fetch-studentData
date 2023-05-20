import React, { useEffect, useState } from "react";
import StudentsPicker from "../components/StudentsPicker";
import StudentsTable from "../components/StudentsTable";
import {
  fetchStudentData,
  fetchSchoolData,
  fetchLegalguardianData,
} from "../utils";

const StudentsDataComponent = () => {
  const [studentsData, setStudentsData] = useState(new Map());
  const [schoolsData, setSchoolsData] = useState(new Map());
  const [legalguardiansData, setLegalguardiansData] = useState(new Map());

  const onStudentsPick = async (studentIds) => {
    const newStudentsData = new Map(studentsData);
    const newSchoolsData = new Map(schoolsData);
    const newLegalguardiansData = new Map(legalguardiansData);

    const studentFetches = studentIds.map(async (studentId) => {
      if (!newStudentsData.has(studentId)) {
        const studentData = await fetchStudentData(studentId);
        newStudentsData.set(studentId, studentData);

        for (const student of studentData) {
          const { schoolId, legalguardianId } = student;

          if (!newSchoolsData.has(schoolId)) {
            const schoolData = await fetchSchoolData(schoolId);
            newSchoolsData.set(schoolId, schoolData);
          }

          if (!newLegalguardiansData.has(legalguardianId)) {
            const legalguardianData = await fetchLegalguardianData(
              legalguardianId
            );
            newLegalguardiansData.set(legalguardianId, legalguardianData);
          }
        }
      }
    });

    await Promise.all(studentFetches);

    setStudentsData(newStudentsData);
    setSchoolsData(newSchoolsData);
    setLegalguardiansData(newLegalguardiansData);
  };

  return (
    <>
      <StudentsPicker onPickHandler={onStudentsPick} />
      <StudentsTable
        studentsData={Array.from(studentsData.values())}
        schoolsData={Array.from(schoolsData.values())}
        LegalguardiansData={Array.from(legalguardiansData.values())}
      />
    </>
  );
};

export default StudentsDataComponent;
