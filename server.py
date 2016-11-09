import os
import json
from flask import Flask, render_template, request
app = Flask(__name__, static_url_path="")

ipaddr = os.getenv("IP", "0.0.0.0")
port = int(os.getenv("PORT", 8080))

@app.route('/api/song', methods = ['POST', 'GET'])
def getsong():
    song = request.args.get("search")
    return song

if __name__ == '__main__':
    app.run(host=ipaddr, port=port, debug=False)
