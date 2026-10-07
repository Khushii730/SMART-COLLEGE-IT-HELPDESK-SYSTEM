const API = "http://127.0.0.1:5000";

let data = [];
let currentFilter = "All";


/* LOGIN */

async function login(){

    let u = document.getElementById("username").value.trim();
    let p = document.getElementById("password").value;

    if(u == "Admin" && p == "1234"){

        sessionStorage.setItem("AdminLogin","true");

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

        await show();

    }else{

        document.getElementById("error").innerText =
        "Invalid username or password";

    }

}


/* DASHBOARD */

async function show(){

    try{

        let response = await fetch(API + "/complaints");

        data = await response.json();


        /* STATUS COUNTS */

        document.getElementById("total").innerText = data.length;

        document.getElementById("pending").innerText =
        data.filter(x => x.status == "Pending").length;

        document.getElementById("progress").innerText =
        data.filter(x => x.status == "In Progress").length;

        document.getElementById("resolved").innerText =
        data.filter(x => x.status == "Resolved").length;

        document.getElementById("unresolved").innerText =
        data.filter(x => x.status == "Unresolved").length;


        /* TEAM COUNTS */

        document.getElementById("network").innerText =
        data.filter(x => x.team == "Network Team").length;

        document.getElementById("hardware").innerText =
        data.filter(x => x.team == "Hardware Team").length;

        document.getElementById("software").innerText =
        data.filter(x => x.team == "Software Team").length;


        /* SHOW COMPLAINTS */

        showComplaints(currentFilter);

    }catch(error){

        document.getElementById("list").innerHTML =
        "<p>Backend is not connected. Please start Flask.</p>";

        console.log(error);

    }

}


/* FILTER */

function showComplaints(filter){

    currentFilter = filter;

    let search =
    document.getElementById("search").value.toLowerCase();

    let result = data.filter(x => {

        let statusMatch =
        filter == "All" || x.status == filter;

        let searchMatch =
        x.ticket_id.toLowerCase().includes(search) ||
        x.student_id.toLowerCase().includes(search) ||
        x.problem.toLowerCase().includes(search) ||
        x.location.toLowerCase().includes(search);

        return statusMatch && searchMatch;

    });


    document.getElementById("complaintTitle").innerText =
    filter == "All"
    ? "All Complaints"
    : filter + " Complaints";


    result = [...result].reverse();


    document.getElementById("list").innerHTML = result.length ?

    result.map(x => `

    <div class="card">

    <h3>${x.ticket_id}</h3>

    <b>Student ID:</b> ${x.student_id}<br>

    <b>Problem:</b> ${x.problem}<br>

    <b>Location:</b> ${x.location}<br>

    <b>Description:</b> ${x.description}<br>

    <b>Priority:</b> ${x.priority || "Not Assigned"}<br>

    <b>Assigned Team:</b> ${x.team || "Not Assigned"}<br>

    <b>Status:</b> ${x.status || "Pending"}

    </div>

    `).join("")

    : "<p>No complaints found.</p>";

}


/* SEARCH */

document.getElementById("search").oninput = function(){

    showComplaints(currentFilter);

};


/* LOGOUT */

function logout(){

    sessionStorage.removeItem("AdminLogin");

    document.getElementById("dashboard").style.display = "none";

    document.getElementById("loginBox").style.display = "block";

}


/* AUTO LOGIN */

if(sessionStorage.getItem("AdminLogin") == "true"){

    document.getElementById("loginBox").style.display = "none";

    document.getElementById("dashboard").style.display = "block";

    show();

}