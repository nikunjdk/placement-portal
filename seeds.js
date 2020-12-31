var Student = require("./models/studentModel");
var Post = require("./models/postModel");

var studentData = [];

var postData = [];

function createStudents() {
    var passout_year = [2021, 2022, 2023, 2024];
    var branch = ['CSE', 'ISE', 'Mech', 'Civil'];
    var branch_prefix = ['CS', 'IS', 'MC', 'CV'];
    var gender = ['male', 'female'];
    var contact_number = '9999999999'
    var email_id = 'abc@pqr.xyz';
    var resume_url = 'https://fake.jsonresume.org/'
    for (let branch_count = 0; branch_count < 4; branch_count++) {
        for (let passout_year_count = 0; passout_year_count < 4; passout_year_count++) {
            var cgpa = 7.0
            var passout_year_prefix = (passout_year[passout_year_count] - 2004).toString()
            for (let cgpa_count = 1; cgpa <= 10.0; cgpa_count++, cgpa = cgpa + 0.1) {
                var data = {
                    usn: '1MS' + passout_year_prefix + branch_prefix[branch_count] + cgpa_count.toString(),
                    name: 'student' + cgpa_count.toString() + '(' + passout_year_prefix + ')',
                    passout_year: passout_year[passout_year_count],
                    branch: branch[branch_count],
                    gender: gender[cgpa_count % 2],
                    contact_number: contact_number,
                    email_id: email_id,
                    cgpa: cgpa,
                    resume_url: resume_url
                };
                studentData.push(data);
            }
        }
    }
}

function createPosts() {
    var job_description = "This is a dummy job"
    var job_type = ['Permanent', 'Internship'];
    var company_name = "Dummy Company";
    var location = 'Bengaluru';
    var allowed_branches = ['CSE', 'ISE', 'Mech', 'Civil'];
    var deadline = Date.now();
    var Salary = '2398472394'
    for (let branch_count = 0; branch_count < 4; branch_count++) {
        for (let min_cgpa = 7; min_cgpa < 10; min_cgpa++) {
            for (let count = 1; count < 11; count++) {
                let data = {
                    job_title: "Job_" + allowed_branches[branch_count].toString() + count.toString(),
                    job_description: job_description,
                    job_type: job_type[count % 2],
                    company_name: company_name,
                    min_cgpa: min_cgpa,
                    location: location,
                    allowed_branches: allowed_branches[branch_count],
                    Salary: Salary,
                    deadline: deadline
                }
                postData.push(data);
            }
        }
    }
}

function seedDB() {
    Student.deleteMany({}, function (err) {
        if (err) {
            return res.status(500).json({
                message: 'Error when deleting post.',
                error: err
            });
        }
    });
    console.log("Deleted Students");
    createStudents();
    Student.insertMany(studentData, function (err) {
        if (err) {
            console.log(err);
        }
        else console.log("Students added to db")
    })
    // studentData.forEach(function (seed) {
    //     Student.create(seed, function (err, student) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when deleting post.',
    //                 error: err
    //             });
    //         }
    //     });
    // });
    console.log('Students created');

    Post.deleteMany({}, function (err) {
        if (err) {
            return res.status(500).json({
                message: 'Error when deleting post.',
                error: err
            });
        }
    });
    console.log("Posts deleted");
    createPosts();
    Post.insertMany(postData, function (err) {
        if (err) {
            console.log(err);
        }
        else console.log("Posts added to db")
    })
    // postData.forEach(function (seed) {
    //     Student.create(seed, function (err) {
    //         if (err) {
    //             return res.status(500).json({
    //                 message: 'Error when deleting post.',
    //                 error: err
    //             });
    //         }
    //     });
    // });
    console.log("Posts created");
}

module.exports = seedDB;