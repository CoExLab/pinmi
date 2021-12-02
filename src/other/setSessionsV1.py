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


udict = {}

input_file = csv.DictReader(open("users.csv"))
output_file = open('added_users.csv', 'w', newline='')
fieldnames = input_file.fieldnames + ['username']
csvwriter = csv.DictWriter(output_file, fieldnames)
csvwriter.writeheader()

for row in input_file:
    name = row["Name"].split()
    fname = name[0]
    lname = name[1]
    username = fname.lower() + lname.lower()
    userid = uuid.uuid4().hex
    trole = row["Role (Therapist/Client)"]
    role = ""
    if(trole == "Therapist"):
        role = "caller"
    else:
        role = "callee"
    udict[username] = {"first": fname, "last": lname, "userID": userid, "username": username, "sessionid": "", "role": role}
    #csvwriter.writerow(dict(row, username='%s' % username))
    user = udict[username]
    print("first: " + user['first'] + " last: " + user['last'] + " userid: " + user['userID'] + " curSession: " + user['sessionid'])
input_file = csv.DictReader(open("users.csv"))

count = 0
for row in input_file:
    name = row["Name"].split()
    pname = row["Partner"].split()
    if(len(pname) > 1):
        username = name[0].lower() + name[1].lower()
        if(len(pname) > 1): 
            pusername = pname[0].lower() + pname[1].lower()
        else:
            pusername = "na" + str(count)
            count += 1
        if(udict[username]["sessionid"] == ""):
            sessionid = uuid.uuid4().hex
            prevuser = udict[username]
            prevuser["sessionid"] = sessionid
            udict[username] = prevuser
            pprevuser = udict[pusername]
            pprevuser["sessionid"] = sessionid
            udict[pusername] = pprevuser
        else:
            caller = {}
            callee = {}
            if(udict[username]["role"] == "caller"):
                caller = udict[username]
                callee = udict[pusername]
            else :
                caller = udict[pusername]
                callee = udict[username]
            print("caller id: " + caller["userID"] + " callee id: " + callee["userID"])
            doc_ref = db.collection(u'sessions').document(udict[username]["sessionid"])
            doc_ref.set({
                u'caller_id': caller['userID'],
                u'callee_id': callee['userID'],
                u'media_url': u'default',
                u'duration': u'0',
                u'transcript': u''
            })
    else:
        print(name[0] + " " + name[1] + " has no partner")

for uN in udict:
    user = udict[uN]
    doc_ref = db.collection(u'users').document(user['username'])
    doc_ref.set({
        u'first': user['first'],
        u'last': user['last'],
        u'userID': user['userID'],
        u'curSession': user['sessionid']
    })
    print("first: " + user['first'] + " last: " + user['last'] + " userid: " + user['userID'] + " curSession: " + user['sessionid'])

