const API_URL = "";

const form = document.querySelector("form");
const nimInput = document.querySelector("#nim");
const namaInput = document.querySelector("#nama");
const jurusanInput = document.querySelector("#jurusan");
const emailInput = document.querySelector("#email");
const tableBody = document.querySelector("tbody");
const searchInput = document.querySelector(".search-box input");
const searchButton = document.querySelector(".search-box button");

async function getStudents() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Gagal mengambil data mahasiswa");
        }
        const students = await response.json();
        displayStudents(students);
    } catch (error) {
        console.error(error);
    }
}

function displayStudents(students) {
    tableBody.innerHTML = "";
    students.forEach((student, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${student.nim}</td>
            <td>${student.nama}</td>
            <td>${student.jurusan}</td>
            <td>${student.email}</td>
            <td>
                <div class="actions">
                    <button type="button" class="action edit" onclick="editStudent('${student.id}')">✎</button>
                    <button type="button" class="action delete" onclick="deleteStudent('${student.id}')">×</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function addStudent(student) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        if (!response.ok) {
            throw new Error("Gagal menambahkan mahasiswa");
        }
        form.reset();
        getStudents();
    } catch (error) {
        console.error(error);
    }
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    const student = {
        nim: nimInput.value,
        nama: namaInput.value,
        jurusan: jurusanInput.value,
        email: emailInput.value
    };
    addStudent(student);
});

async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Gagal mengambil data mahasiswa");
        }
        const student = await response.json();
        nimInput.value = student.nim;
        namaInput.value = student.nama;
        jurusanInput.value = student.jurusan;
        emailInput.value = student.email;
    } catch (error) {
        console.error(error);
    }
}

async function updateStudent(id, student) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(student)
        });
        if (!response.ok) {
            throw new Error("Gagal mengubah data mahasiswa");
        }
        form.reset();
        getStudents();
    } catch (error) {
        console.error(error);
    }
}

async function deleteStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("Gagal menghapus mahasiswa");
        }
        getStudents();
    } catch (error) {
        console.error(error);
    }
}

async function searchStudents(keyword) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Gagal mengambil data mahasiswa");
        }
        const students = await response.json();
        const result = students.filter(student => {
            return (
                student.nim.toLowerCase().includes(keyword) ||
                student.nama.toLowerCase().includes(keyword) ||
                student.jurusan.toLowerCase().includes(keyword) ||
                student.email.toLowerCase().includes(keyword)
            );
        });
        displayStudents(result);
    } catch (error) {
        console.error(error);
    }
}

searchButton.addEventListener("click", function () {
    const keyword = searchInput.value.toLowerCase();
    searchStudents(keyword);
});

searchInput.addEventListener("keyup", function () {
    const keyword = searchInput.value.toLowerCase();
    searchStudents(keyword);
});