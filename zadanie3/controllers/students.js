let students = [];
let nextId = 1;

exports.getAddNewStudentPage = (req, res) => {
    res.render('Home');
};

exports.addStudent = (req, res) => {
    const newStudent = {
        id: nextId,
        fullName: req.body.fullName,
        code: req.body.code,
        fieldOfStudies: req.body.fieldOfStudies
    };
    students.push(newStudent);
    nextId++;
    res.redirect('/success');
};

exports.getAddingNewStudentSuccessPage = (req, res) => {
    res.render('Success');
};

exports.getStudentsListPage = (req, res) => {
    res.render('List', { students });
};
