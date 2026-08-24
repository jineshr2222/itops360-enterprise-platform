import csv
from collections import Counter

INPUT = "incidents.csv"

def build_report(path=INPUT):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    status_counts = Counter(row["status"] for row in rows)
    priority_counts = Counter(row["priority"] for row in rows)

    print("ITOps360 SLA / Operations Report")
    print("--------------------------------")
    print("Total incidents:", len(rows))
    print("By status:", dict(status_counts))
    print("By priority:", dict(priority_counts))

if __name__ == "__main__":
    build_report()
