import os
import json
import db_utils
import simplejson as json
from flask import Flask, render_template, request, jsonify
app = Flask(__name__, static_url_path="")

db = db_utils.DBconnector(os.environ["DATABASE_URL"])

rows = db.query("""SELECT %s from userdata""", ['id'])

ipaddr = os.getenv("IP", "0.0.0.0")
port = int(os.getenv("PORT", 8080))

@app.route('/api/report/<username>', methods = ['POST', 'GET'])
def postresults(username):
    global db
    results = request.get_json()['results']
    for result in results:
        previous = db.query("select * from userdata where username = %s and key = %s and scaledegree = %s", [username, result["key"], result["scaledegree"]])
        if len(previous) == 0:
            db.insert("insert into userdata (username, key, scaledegree, totalanswered, totalcorrect, averagetime) values(%s, %s, %s, %s, %s, %s)",
                [username, result['key'], result['scaledegree'], 1, 1 if result['correct'] else 0, result['time']])
        else:
            previous = previous[0]
            previous_id = previous[0]
            previous_username = previous[1]
            previous_key = previous[2]
            previous_scaledegree = previous[3]
            previous_totalanswered = previous[4]
            previous_totalcorrect = previous[5]
            previous_averagetime = previous[6]

            new_average = (result['time'] + previous_averagetime * previous_totalanswered) / (previous_totalanswered + 1)
            db.update("update userdata set totalanswered = %s, totalcorrect = %s, averagetime = %s where id = %s",
                [previous['totalanswered'] + 1, previous['totalcorrect'] + 1 if result['correct'] else 0,  new_average, previous['id']])

    return json.dumps(results)

@app.route('/api/getdata/<username>', methods = ['GET'])
def getdata(username):
    # return json.dumps(db.query("select * from userdata"))
    return jsonify(db.query("select * from userdata where username = %s", [username]))

if __name__ == '__main__':
    app.run(host=ipaddr, port=port, debug=False)
