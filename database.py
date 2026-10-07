from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["smart_college_helpdesk"]

complaints = db["complaints"]


def add_complaint(data):
    complaints.insert_one(data)
    data.pop("_id", None)

def get_all_complaints():
    return list(complaints.find({}, {"_id": 0}))


def update_complaint(ticket_id, data):
    result = complaints.update_one(
        {"ticket_id": ticket_id},
        {
            "$set": {
                "priority": data.get("priority", ""),
                "team": data.get("team", ""),
                "status": data.get("status", "")
            }
        }
    )

    return result.matched_count