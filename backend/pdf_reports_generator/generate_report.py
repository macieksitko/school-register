import argparse
from datetime import date, datetime
from time import perf_counter_ns
import calendar
import os
from pymongo import MongoClient
from bson import ObjectId
from fpdf import FPDF
from unidecode import unidecode
import sys

start_time = perf_counter_ns()

def get_first_day_of_current_semester():
    today = date.today()
    month = today.month
    semester_start_date = date.fromisoformat(f'{today.year - 1}-10-01') if month >= 10 or month <= 3 else date.fromisoformat(f'{today.year}-03-01')
    return semester_start_date

def get_last_day_of_current_semester():
    today = date.today()
    month = today.month
    semester_end_date = date.fromisoformat(f'{today.year}-09-30')
    if(month >= 10 or month <= 3):
        year = today.year + 1 if month >= 10 else today.year
        day = 29 if calendar.isleap(year) else 28
        semester_end_date = date.fromisoformat(f'{year}-02-{day}')
    return semester_end_date

parser = argparse.ArgumentParser(description='Generate PDF report with students\' grades summary')
parser.add_argument('--from', help='Start date of report in ISO format, e.g. 2020-12-01 (default: first day of current semester)',
    type=date.fromisoformat,
    action='store',
    default=None
)
parser.add_argument('--to', help='End date of report in ISO format, e.g. 2020-12-01 (default: last day of current semester)',
    type=date.fromisoformat,
    action='store',
    default=None
)
parser.add_argument('-t', '--teacher', help='Teacher\'s _id who assigned mark', type=str, required=True, action='store')
parser.add_argument('-s', '--subject', help='Subject\'s _id', type=str, required=True, action='store')

args = vars(parser.parse_args())

if((args['from'] != None and args['to'] == None) or (args['from'] == None and args['to'] != None)):
    parser.exit('Both --from and --to arguments must be defined')

if(args['from'] == None):
    args['from'] = get_first_day_of_current_semester()

if(args['to'] == None):
    args['to'] = get_last_day_of_current_semester()

MONGODB_URL: str = os.getenv('REPORTS_MONGO_DB_URL')
if(MONGODB_URL == None):
     print(f'Cannot find REPORTS_MONGO_DB_URL env variable')
     sys.exit(1)

client = MongoClient(MONGODB_URL)
db = client.school_register

marks_coll = db.marks
students_coll = db.students

teacher = db.teachers.find_one({'_id': ObjectId(args['teacher'])})
if(teacher == None):
    teacher_id = args['teacher']
    print(f'Cannot find teacher with _id {teacher_id}')
    sys.exit(2)
subject = db.subjects.find_one({'_id': ObjectId(args['subject'])})
if(subject == None):
    subject_id = args['subject']
    print(f'Cannot find subject with _id {subject_id}')
    sys.exit(3)

class PDF(FPDF):
    def footer(self):
        self.set_y(-1)
        self.set_font(family='Roboto', size=10)
        self.cell(w=0, h=1, txt=str(self.page_no()), ln=0, border=0, align='C')


def init_pdf(teacher_name, subject_name, from_date, to_date):
    pdf = PDF(orientation='P', format='A4', unit='cm')

    dirname = os.path.dirname(__file__)
    pdf.add_font(family='Roboto', style='', fname=os.path.join(dirname, 'fonts/Roboto-Regular.ttf'), uni=True)
    pdf.add_font(family='Roboto', style='B', fname=os.path.join(dirname, 'fonts/Roboto-Bold.ttf'), uni=True)
    pdf.add_font(family='Roboto', style='I', fname=os.path.join(dirname, 'fonts/Roboto-Italic.ttf'), uni=True)
    pdf.add_font(family='Roboto', style='BI', fname=os.path.join(dirname, 'fonts/Roboto-BoldItalic.ttf'), uni=True)

    pdf.add_page()
    pdf.set_font(family='Roboto', size=16, style='B')
    pdf.image(name='icon.png', w=2, h=2, x=(pdf.w / 2) - 1, y = 0.5)   
    pdf.set_y(y=3)

    pdf.cell(h=1, w=pdf.w - 2, txt=f'Grades report for subject {subject_name},', ln=1, align='C')
    pdf.cell(h=1, w=pdf.w - 2, txt=f'generated by {teacher_name}', ln=1, align='C')

    pdf.set_font(family='Roboto', size=14, style='I')
    pdf.cell(h=2, w=pdf.w - 2, txt=f'Report for grades assigned between {from_date} and {to_date}', ln=1, align='C')

    pdf.set_font(family='Roboto', size=10, style='I')
    pdf.cell(h=0.5, w=pdf.w - 2, txt=f'Legend for mark types:', ln=1, align='L')
    pdf.set_font(style='')
    pdf.cell(h=0.5, w=pdf.w - 2, txt=f'**U** - Unit, **T1** - Term 1, **T2** - Term 2, **F** - Final', ln=1, align='L', markdown=True)
    
    pdf.set_font(family='Roboto', size=10)
    pdf.ln()
    
    return pdf

subject_name = subject.get('name')
teacher_name = teacher.get('name')
teacher_last_name = teacher.get('lastName')

pdf = init_pdf(teacher_name=f'{teacher_name} {teacher_last_name}', subject_name=subject_name, from_date=args['from'], to_date=args['to'])

docs_count = marks_coll.count_documents(
    {
        'creationDate':
            {'$lte': datetime.fromordinal(args['to'].toordinal()),
             '$gte': datetime.fromordinal(args['from'].toordinal()) 
            },
    'teacher': ObjectId(args['teacher']),
    'subject': ObjectId(args['subject'])
    }
)

LINE_HEIGHT = pdf.font_size * 2
DOC_WIDTH = pdf.w - 2 #margin is considered

generation_time = datetime.now().strftime('%d.%m.%Y %H:%M')
pdf.cell(h=0.5, w=DOC_WIDTH, txt=f'Report generated at **{generation_time}**', ln=1, align='L', markdown=True)
pdf.cell(h=0.5, w=DOC_WIDTH, txt=f'Records included in this report, meeting report\'s criterias: **{docs_count}**', ln=1, align='L', markdown=True)

TABLE_COLS = ('No.', 'Date', 'Student', 'Term No.', 'Weight', 'Type', 'Grade')
TABLE_COLS_WIDTHS = (0.07 * DOC_WIDTH, 0.21 * DOC_WIDTH, 0.42 * DOC_WIDTH, 0.09 * DOC_WIDTH, 0.07 * DOC_WIDTH, 0.06 * DOC_WIDTH, 0.08 * DOC_WIDTH)

i = 0
for col in TABLE_COLS:
    pdf.cell(w=TABLE_COLS_WIDTHS[i], h=LINE_HEIGHT, txt=col, border=1, align='C')
    i += 1
pdf.ln(LINE_HEIGHT)

def print_table_cell(pdf, no, marks_doc, student_name):
    pdf.cell(w=TABLE_COLS_WIDTHS[0], h=LINE_HEIGHT, txt=str(no), border=1, align='C')
    time = marks_doc.get('creationDate').strftime('%H:%M')
    date = marks_doc.get('creationDate').strftime('%d.%m.%Y')
    pdf.cell(w=TABLE_COLS_WIDTHS[1], h=LINE_HEIGHT, txt=f'{date} {time}', border=1, align='C')
    pdf.cell(w=TABLE_COLS_WIDTHS[2], h=LINE_HEIGHT, txt=student_name, border=1, align='C')
    pdf.cell(w=TABLE_COLS_WIDTHS[3], h=LINE_HEIGHT, txt=str(marks_doc.get('termNumber')), border=1, align='C')
    pdf.cell(w=TABLE_COLS_WIDTHS[4], h=LINE_HEIGHT, txt=str(marks_doc.get('weight')), border=1, align='C')
    mark_type = marks_doc.get('markType')
    if(mark_type == 'UNIT'):
        mark_type = 'U'
    elif(mark_type == 'TERM1'):
        mark_type = 'T1'
    elif(mark_type == 'TERM2'):
        mark_type = 'T2'
    else:
        mark_type = 'F'
    pdf.cell(w=TABLE_COLS_WIDTHS[5], h=LINE_HEIGHT, txt=mark_type, border=1, align='C')
    pdf.cell(w=TABLE_COLS_WIDTHS[6], h=LINE_HEIGHT, txt=str(marks_doc.get('grade')), border=1, align='C')


found_documents = marks_coll.find(
    {
        'creationDate': 
        {
            '$lte': datetime.fromordinal(args['to'].toordinal()),
            '$gte': datetime.fromordinal(args['from'].toordinal())
         },
        'teacher': ObjectId(args['teacher']),
        'subject': ObjectId(args['subject'])
    },
    {
        '_id': 1,
        'subject': 1,
        'teacher': 1,
        'markType': 1,
        'termNumber': 1,
        'weight': 1,
        'grade': 1,
        'comment': 1,
        'creationDate': 1
    }
)

i = 1
for document in found_documents: 
    stud = students_coll.find_one({"marks": ObjectId(document.get('_id'))})
    stud_name = stud.get('name')
    stud_last_name = stud.get('lastName')

    print_table_cell(pdf=pdf, no=i,  marks_doc=document, student_name=f'{stud_name} {stud_last_name}')
    pdf.ln(LINE_HEIGHT)
    i += 1

def save_pdf(pdf):
    pdf.set_author(unidecode(f'{teacher_name} {teacher_last_name}'))
    pdf.set_title(unidecode(f'Grades report for {subject_name}'))
    abs_path = os.path.dirname(os.path.abspath(__file__))
    pdf_path = f"{abs_path}/report_{subject_name.replace(' ', '_')}_{generation_time.replace(' ', '_')}.pdf"
    pdf.output(pdf_path, 'F')

    return pdf_path

pdf_path = save_pdf(pdf)

end_time = perf_counter_ns()
execution_time = (end_time - start_time) / 1e9
print(f'Report generated in: {execution_time} seconds')
print(f'Report saved in: {pdf_path}')