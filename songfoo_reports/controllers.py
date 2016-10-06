import os
import shutil
import json
from flask import Flask, request, Response
from flask import render_template, url_for, redirect, send_from_directory
from flask import send_file, make_response, abort

from songfoo_reports import app

# routing for API endpoints, generated from the models designated as API_MODELS
from songfoo_reports.core import api_manager
from songfoo_reports.models import *

for model_name in app.config['API_MODELS']:
    model_class = app.config['API_MODELS'][model_name]
    api_manager.create_api(model_class, methods=['GET', 'POST'])

session = api_manager.session


# routing for basic pages (pass routing onto the Angular app)
@app.route('/')
@app.route('/about')
@app.route('/blog')
@app.route('/reports')
def basic_pages(**kwargs):
    return make_response(open('songfoo_reports/templates/index.html').read())


# routing for CRUD-style endpoints
# passes routing onto the angular frontend if the requested resource exists
from sqlalchemy.sql import exists

crud_url_models = app.config['CRUD_URL_MODELS']


@app.route('/<model_name>/')
@app.route('/<model_name>/<item_id>')
def rest_pages(model_name, item_id=None):
    if model_name in crud_url_models:
        model_class = crud_url_models[model_name]
        if item_id is None or session.query(exists().where(
                model_class.id == item_id)).scalar():
            return make_response(open(
                'songfoo_reports/templates/index.html').read())
    abort(404)


# special file handlers and error handlers
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'img/favicon.ico')


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


def _do_reset(reportid):
    shutil.copy('data/model_reports/%s.json' % reportid, 'data/runtime_reports/%s.json' % reportid)


def _save_report(reportid, report_json):
    print type(report_json)
    with open('data/runtime_reports/%s.json' % reportid, 'r+b') as content_file:
        fmt = json.dumps(json.loads(report_json), indent=2)
        print type(fmt)
        content_file.write(fmt)


def _get_report(reportid):
    with open('data/runtime_reports/%s.json' % reportid, 'r') as content_file:
        return content_file.read()


@app.route('/reset/reports/<reportid>', methods = ['GET'])
def reset_reports(reportid):
    """return the information for <reportid>"""
    _do_reset(reportid)
    return _get_report(reportid)


@app.route('/load/reports/<reportid>', methods = ['GET', 'PATCH'])
def api_reports(reportid):
    if request.method == 'GET':
        """return the information for <reportid>"""
        return _get_report(reportid)

    if request.method == 'PATCH':
        parms = request.get_json()
        _save_report(reportid, parms.get('report_json'))
        return 'success'
        # return {'success': True}

