import React from "react";
import StudentService from '../../api/student.service';
import TokenService from "../../api/token.service";
import MarkSheetGrid from "../../components/mark-sheet-grid/mark-sheet-grid";
import {MarkTypes} from "../../enums/markTypes";

class Attendance extends React.Component {
    state = {
        subjects: []
    }

    componentDidMount() {
        StudentService.getStudent(TokenService.getUserId()).then((response) => {
            let subjects = response.data.subjects;
            let marks = response.data.marks;

            for (let sub of subjects) {
                const idSubject = sub._id;
                sub.term1Grades = marks.filter((mark) => { return (mark.markType === MarkTypes.UNIT) && (mark.termNumber === 1) && (mark.subject === idSubject); });
                sub.term2Grades = marks.filter((mark) => { return (mark.markType === MarkTypes.UNIT) && (mark.termNumber === 2) && (mark.subject === idSubject); });

                sub.term1Grade = marks.filter((mark) => { return (mark.markType === MarkTypes.TERM1) && (mark.subject === idSubject); })[0]?.grade;
                // TODO maybe: sub.term1Avg = ;

                sub.term2Grade = marks.filter((mark) => { return (mark.markType === MarkTypes.TERM2) && (mark.subject === idSubject); })[0]?.grade;
                // TODO maybe: sub.term2Avg = ;

                // TODO maybe: sub.finalAvg = ;
                sub.finalGrade = marks.filter((mark) => { return (mark.markType === MarkTypes.FINAL) && (mark.subject === idSubject); })[0]?.grade;
            }
            this.setState({
                subjects: subjects
            });
        });
    }
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <MarkSheetGrid grades={this.state.subjects} />
            </React.Fragment>
        );
    }
}

export default Attendance;
