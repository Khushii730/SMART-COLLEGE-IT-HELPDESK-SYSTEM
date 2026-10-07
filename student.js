document.addEventListener("DOMContentLoaded", () => {

    const API = "http://127.0.0.1:5000";

    const $ = id => document.getElementById(id);

    let problem = $("problem"),
        locationBox = $("locationBox"),
        otherProblem = $("otherProblem"),
        otherLocation = $("otherLocation"),
        popup = $("popup");

    problem.onchange = () => {
        otherProblem.style.display =
            problem.value == "Other" ? "block" : "none";
    };

    locationBox.onchange = () => {
        otherLocation.style.display =
            locationBox.value == "Other" ? "block" : "none";
    };

    $("myTickets").onclick = () => {
        popup.style.display = "flex";
    };

    $("close").onclick = () => {
        popup.style.display = "none";
    };

    $("submit").onclick = async () => {

        let s = $("studentId").value.trim();
        let p = problem.value;
        let l = locationBox.value;
        let d = $("description").value.trim();

        if (p == "Other")
            p = otherProblem.value.trim();

        if (l == "Other")
            l = otherLocation.value.trim();

        if (!s || !p || !l || !d) {
            alert("Please fill all required fields.");
            return;
        }

        try {

            let response = await fetch(API + "/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    student_id: s,
                    problem: p,
                    location: l,
                    description: d
                })
            });

            let result = await response.json();

            if (!response.ok) {
                alert("Complaint could not be submitted.");
                return;
            }

            let id = result.complaint.ticket_id;

            $("successMessage").innerHTML =
                "Complaint Submitted Successfully!<br>Ticket ID: <b>" + id + "</b>";

            $("successMessage").style.display = "block";

            $("studentId").value = "";
            problem.value = "";
            locationBox.value = "";
            $("description").value = "";
            otherProblem.value = "";
            otherLocation.value = "";

            otherProblem.style.display = "none";
            otherLocation.style.display = "none";

        } catch (error) {

            alert("Backend is not connected. Please start Flask.");

            console.log(error);
        }
    };

    $("view").onclick = async () => {

        let id = $("searchId").value.trim();

        if (!id) {
            $("tickets").innerHTML = "Please enter Student ID.";
            return;
        }

        try {

            let response = await fetch(API + "/complaints");
            let data = await response.json();

            let result = data.filter(x => x.student_id == id);

            $("tickets").innerHTML = result.length
                ? result.map(x => `
                    <div class="ticket">
                        <b>Ticket ID:</b> ${x.ticket_id}<br>
                        <b>Problem:</b> ${x.problem}<br>
                        <b>Location:</b> ${x.location}<br>
                        <b>Description:</b> ${x.description}<br>
                        <b>Status:</b> ${x.status}
                    </div>
                `).join("")
                : "No tickets found.";

        } catch (error) {

            $("tickets").innerHTML =
                "Backend is not connected. Please start Flask.";

            console.log(error);
        }
    };

});