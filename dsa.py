from collections import deque

complaint_queue = deque()


def add_to_queue(complaint):
    complaint_queue.append(complaint)


def get_queue():
    return list(complaint_queue)


def search_complaints(complaints, keyword):
    keyword = keyword.lower()

    result = []

    for complaint in complaints:
        if (
            keyword in complaint.get("ticket_id", "").lower()
            or keyword in complaint.get("student_id", "").lower()
            or keyword in complaint.get("problem", "").lower()
            or keyword in complaint.get("location", "").lower()
        ):
            result.append(complaint)

    return result


def sort_complaints(complaints):
    return sorted(
        complaints,
        key=lambda x: x.get("created_at", ""),
        reverse=True
    )