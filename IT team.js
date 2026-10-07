const API = "http://127.0.0.1:5000";

let data = [];


async function login(){

    let u = document.getElementById("username").value.trim();
    let p = document.getElementById("password").value;

    if(u == "ITTeam" && p == "1234"){

        sessionStorage.setItem("ITLogin","true");

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("dashboard").style.display = "block";

        await show();

    }else{

        document.getElementById("error").innerText =
        "Invalid username or password";

    }

}


async function show(){

    try{

        let response = await fetch(API + "/complaints");

        data = await response.json();

        let search = document.getElementById("search").value.toLowerCase();

        let result = data.filter(x =>
            x.ticket_id.toLowerCase().includes(search) ||
            x.student_id.toLowerCase().includes(search) ||
            x.problem.toLowerCase().includes(search) ||
            x.location.toLowerCase().includes(search)
        );

        result = [...result].reverse();

        document.getElementById("list").innerHTML = result.length ?

        result.map(x => {

            let priority = x.priority || "";
            let team = x.team || "";
            let status = x.status || "";

            return `

            <div class="card">

            <h3>${x.ticket_id}</h3>

            <p>
            <b>Student ID:</b> ${x.student_id}<br>
            <b>Problem:</b> ${x.problem}<br>
            <b>Location:</b> ${x.location}<br>
            <b>Description:</b> ${x.description}
            </p>

            <label><b>Priority:</b></label>

            <select id="p${x.ticket_id}">

            <option value="" ${priority==""?"selected":""} hidden>
            Select Priority
            </option>

            <option ${priority=="Low"?"selected":""}>Low</option>

            <option ${priority=="Medium"?"selected":""}>Medium</option>

            <option ${priority=="High"?"selected":""}>High</option>

            </select>


            <label><b>Team:</b></label>

            <select id="t${x.ticket_id}">

            <option value="" ${team==""?"selected":""} hidden>
            Select Assign Team
            </option>

            <option ${team=="Network Team"?"selected":""}>
            Network Team
            </option>

            <option ${team=="Hardware Team"?"selected":""}>
            Hardware Team
            </option>

            <option ${team=="Software Team"?"selected":""}>
            Software Team
            </option>

            </select>


            <label><b>Status:</b></label>

            <select id="s${x.ticket_id}">

            <option value="" ${status==""?"selected":""} hidden>
            Select Status
            </option>

            <option ${status=="Pending"?"selected":""}>
            Pending
            </option>

            <option ${status=="In Progress"?"selected":""}>
            In Progress
            </option>

            <option ${status=="Resolved"?"selected":""}>
            Resolved
            </option>

            <option ${status=="Unresolved"?"selected":""}>
            Unresolved
            </option>

            </select>

            <br>

            <button class="update"
            onclick="updateComplaint('${x.ticket_id}')">
            Update
            </button>

            <p id="m${x.ticket_id}" class="success"></p>

            <p id="w${x.ticket_id}" class="warning"></p>

            </div>

            `;

        }).join("")

        : "<p>No complaints found.</p>";

    }catch(error){

        document.getElementById("list").innerHTML =
        "<p>Backend is not connected. Please start Flask.</p>";

        console.log(error);
    }

}


async function updateComplaint(id){

    let priority =
        document.getElementById("p"+id).value;

    let team =
        document.getElementById("t"+id).value;

    let status =
        document.getElementById("s"+id).value;

    let success =
        document.getElementById("m"+id);

    let warning =
        document.getElementById("w"+id);


    /* ALL EMPTY */

    if(!priority && !team && !status){

        warning.innerText =
        "Please select Priority, Assign Team and Status";

        warning.style.display = "block";
        success.style.display = "none";

        return;
    }


    /* PRIORITY EMPTY */

    if(!priority){

        warning.innerText =
        "Please select Priority";

        warning.style.display = "block";
        success.style.display = "none";

        return;
    }


    /* TEAM EMPTY */

    if(!team){

        warning.innerText =
        "Please select Assign Team";

        warning.style.display = "block";
        success.style.display = "none";

        return;
    }


    /* STATUS EMPTY */

    if(!status){

        warning.innerText =
        "Please select Status";

        warning.style.display = "block";
        success.style.display = "none";

        return;
    }


    /* UPDATE IN MONGODB */

    try{

        let response = await fetch(
            API + "/complaints/" + id,
            {
                method: "PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    priority: priority,
                    team: team,
                    status: status
                })
            }
        );

        let result = await response.json();

        if(!response.ok){

            warning.innerText = result.message;

            warning.style.display = "block";
            success.style.display = "none";

            return;
        }


        warning.style.display = "none";

        success.innerText =
        "Complaint Updated Successfully!";

        success.style.display = "block";

    }catch(error){

        warning.innerText =
        "Backend is not connected. Please start Flask.";

        warning.style.display = "block";

        success.style.display = "none";

        console.log(error);
    }

}


function logout(){

    sessionStorage.removeItem("ITLogin");

    document.getElementById("dashboard").style.display = "none";

    document.getElementById("loginBox").style.display = "block";

}


document.getElementById("search").oninput = show;


if(sessionStorage.getItem("ITLogin") == "true"){

    document.getElementById("loginBox").style.display = "none";

    document.getElementById("dashboard").style.display = "block";

    show();

}