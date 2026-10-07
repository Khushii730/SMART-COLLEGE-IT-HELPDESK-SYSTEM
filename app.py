import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime

from DSA.dsa import add_to_queue, sort_complaints, search_complaints
from Database.database import add_complaint, get_all_complaints, update_complaint

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Smart College IT Helpdesk Backend is Running"


@app.route("/complaints", methods=["POST"])
def create_complaint():
    data = request.json

    complaint = {
        "ticket_id": "TKT" + datetime.now().strftime("%H%M%S"),
        "student_id": data.get("student_id"),
        "problem": data.get("problem"),
        "location": data.get("location"),
        "description": data.get("description"),
        "priority": "",
        "team": "",
        "status": "Pending",
        "created_at": datetime.now().isoformat()
    }

    add_complaint(complaint)
    add_to_queue(complaint)

    return jsonify({
        "message": "Complaint submitted successfully",
        "complaint": complaint
    }), 201


@app.route("/complaints", methods=["GET"])
def get_complaints():
    complaints = get_all_complaints()
    complaints = sort_complaints(complaints)

    return jsonify(complaints)


@app.route("/complaints/search")
def search():
    keyword = request.args.get("q", "")

    complaints = get_all_complaints()
    result = search_complaints(complaints, keyword)

    return jsonify(result)


@app.route("/complaints/<ticket_id>", methods=["PUT"])
def update(ticket_id):
    data = request.json

    result = update_complaint(ticket_id, data)

    if result:
        return jsonify({"message": "Complaint updated successfully"})

    return jsonify({"message": "Ticket not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)