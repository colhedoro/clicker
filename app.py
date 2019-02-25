import os

from flask import Flask, flash, jsonify, redirect, render_template, request, session, send_from_directory, url_for
from flask_session import Session
from tempfile import mkdtemp

# Configure application
app = Flask(__name__)


# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

# Ensure responses aren't cached.
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run()