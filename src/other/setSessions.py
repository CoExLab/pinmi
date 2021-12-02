import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import uuid
import csv
import random

# Use the application default credentials
cred = credentials.Certificate("./pinmi-59c77-firebase-adminsdk-z692d-cb44b7b3d2.json")
firebase_admin.initialize_app(cred)


db = firestore.client()


ulist = []
keeplist = []

input_file = csv.DictReader(open("users.csv"))
output_file = open('added_users.csv', 'w', newline='')
fieldnames = input_file.fieldnames + ['username']
csvwriter = csv.DictWriter(output_file, fieldnames)
csvwriter.writeheader()

for row in input_file:
    fname = row["first_name"]
    lname = row["last_name"]
    username = fname.lower() + lname.lower()
    userid = uuid.uuid4().hex
    ulist.append({"first": fname, "last": lname, "userID": userid, "username": username})
    csvwriter.writerow(dict(row, username='%s' % username))

for user in ulist:
    doc_ref = db.collection(u'users').document(user['username'])
    doc_ref.set({
        u'first': user['first'],
        u'last': user['last'],
        u'userID': user['userID'],
        u'curSession': ''
    })

while(len(ulist) > 1):
    pair = random.sample(range(0, len(ulist) - 1), 2)
    caller = ulist[pair[0]]
    callee = ulist[pair[1]]
    sessionID = uuid.uuid4().hex

    print("caller: " + caller['first'] + ", callee: " + callee['first'] + ", session: " + sessionID)
    
    doc_ref = db.collection(u'users').document(caller['username'])
    doc_ref.update({
        u'curSession': sessionID
    })

    doc_ref = db.collection(u'users').document(callee['username'])
    doc_ref.update({
        u'curSession': sessionID
    })
    
    doc_ref = db.collection(u'sessions').document(sessionID)
    doc_ref.set({
        u'caller_id': caller['userID'],
        u'callee_id': callee['userID'],
        u'media_url': u'default',
        u'duration': u'0',
        u'transcript': u''
    })
    ulist.pop(pair[0])
    ulist.pop(pair[1])
