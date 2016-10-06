import os
import json
from flask import Flask, request, Response
from flask import render_template, send_from_directory, url_for

app = Flask(__name__)

app.config.from_object('songfoo_reports.settings')

app.url_map.strict_slashes = False

import songfoo_reports.core
import songfoo_reports.models
import songfoo_reports.controllers
