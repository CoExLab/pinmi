import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import uuid
import csv
import random

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': "pinmi-59c77",
})

db = firestore.client()


ulist = []

input_file = csv.DictReader(open("users.csv"))
for row in input_file:
    fname = row["first_name"]
    lname = row["last_name"]
    userid = uuid.uuid4().hex
    ulist.append({"first": fname, "last": lname, "userID": userid})

arr_len = ulist.size()
room_size = arr_len // 2
count = 0

while(ulist.size() > 1):
    pair = ulist[random.sample(range(0, ulist.size()), 2)]
    caller = ulist[pair[0]]
    caller_username = caller.first.lower() + caller.last.lower()
    callee = ulist[pair[1]]
    callee_username = callee.first.lower() + callee.last.lower()
    sessionID = uuid.uuid4().hex
    
    doc_ref = db.collection(u'users').document(caller_username)
    doc_ref.set({
        u'first': caller.first,
        u'last': caller.last,
        u'userID': caller.userID
    })
    doc_ref = db.collection(u'users').document(callee_username')
    doc_ref.set({
        u'first': callee.first,
        u'last': callee.last,
        u'userID': callee.userID
    })
    doc_ref = db.collection(u'rooms').document(u'room'+ str(count))
    doc_ref.set({
        u'first': caller.first,
        u'last': caller.last,
        u'userID': caller.userID
    })



