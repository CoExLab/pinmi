import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import uuid
import csv
import random

# Use the application default credentials
cred = credentials.Certificate(
    "../../../pinmi-59c77-firebase-adminsdk-z692d-955bbf0b26.json")
firebase_admin.initialize_app(cred)


db = firestore.client()


udict = {}

input_file = csv.DictReader(open("users.csv"))
output_file = open('added_users.csv', 'w', newline='')
fieldnames = input_file.fieldnames + ['username']
csvwriter = csv.DictWriter(output_file, fieldnames)
csvwriter.writeheader()

for row in input_file:
    # Generate first and last name
    name = row["Name"].split()
    if(len(name) > 1):
        fname = name[0]
        lname = name[1]
    else:
        fname = ""
        lname = ""
    #get username
    username = row["Pin-MI Login Name"]
    # check if userid already exists (user is already existent)
    userid = ""
    doc = db.collection(u'users').document(username).get()
    if(doc.exists):
        userid = doc.to_dict().get('userID')
        print("User: " + username + " already exists")
    else:
        userid = uuid.uuid4().hex
        print("User: " + username + " is new")
    # assign role
    trole = row["Role (Therapist/Client)"]
    role = ""
    if(trole == "Therapist"):
        role = "caller"
    else:
        role = "callee"
    # create dictionary key-obj entry
    udict[username] = {"first": fname, "last": lname, "userID": userid,
        "username": username, "sessionid": "", "role": role}
    # printing for confirmation
    user = udict[username]
    print("first: " + user['first'] + " last: " + user['last'] +
          " userid: " + user['userID'] + " curSession: " + user['sessionid'])
input_file = csv.DictReader(open("users.csv"))

numPairs = len(list(input_file)) // 2

for x in range(1, numPairs):
    # for each pair, create a sessionid (based off of current login format)
    sessionid = uuid.uuid4().hex
    partner1 = str(x) + 'a'
    partner2 = str(x) + 'b'
    udict[partner1]["sessionid"] = sessionid
    udict[partner2]["sessionid"] = sessionid

    if(udict[partner1]["role"] == "caller"):
        caller = udict[partner1]
        callee = udict[partner2]
    else:
        caller = udict[partner2]
        callee = udict[partner1]
    print("caller id: " + caller["userID"] + " callee id: " + callee["userID"])
    # create the session doc
    doc_ref = db.collection(u'sessions').document(sessionid)
    doc_ref.set({
        u'caller_id': caller['userID'],
        u'callee_id': callee['userID'],
        u'media_url': u'default',
        u'duration': u'0',
    })

for uN in udict:
    user = udict[uN]
    doc_ref = db.collection(u'users').document(user['username'])
    doc_ref.set({
        u'first': user['first'],
        u'last': user['last'],
        u'userID': user['userID'],
        u'curSession': user['sessionid']
    })
    print(user['username'] + " added")
