from flask import jsonify, request, Blueprint
import os
from flask import Flask, flash, request, redirect, url_for, session
from werkzeug.utils import secure_filename
import pandas as pd
from service import *

home = Blueprint('home', __name__)
UPLOAD_FOLDER = r'C:\\Users\\User-16\\Desktop\\Alphaa Project\\data'


@home.route('/delete-hyper-tables-data', methods=['POST'])
def deleteDataFromHyper():
    file_name = request.get_json()
    data_id = file_name["id"]
    file_name = file_name["data"] + ".hyper"
    table_data, columns = run_delete_data_in_existing_hyper_file(file_name, data_id)
    content = {"table": table_data[0:5], "columns": columns }
    return jsonify(content)


@home.route('/update-hyper-tables-data', methods=['POST'])
def updateDataFromHyper():
    file_name = request.get_json()
    data_id = file_name["id"]
    col_name = file_name["col"]
    col_value = file_name["value"]
    file_name = file_name["data"] + ".hyper"
    table_data, columns = run_update_data_in_existing_hyper_file(file_name, data_id, col_name, col_value)
    content = {"table": table_data[0:5], "columns": columns }
    return jsonify(content)

@home.route('/get-hyper-tables-data', methods=['POST'])
def getTableFromHyper():
    file_name = request.get_json()
    file_name = file_name["data"] + ".hyper"
    table_data, columns = run_read_data_from_existing_hyper_file(file_name)
    content = {"table": table_data[0:5], "columns": columns }
    return jsonify(content)


@home.route('/get-sql-hyper-tables-data', methods=['POST'])
def getSQLDataFromHyper():
    file_name = request.get_json()
    sql_text = file_name["dataSql"]
    print(sql_text)
    file_name = file_name["data"] + ".hyper"
    table_data, columns = run_read_data_from_existing_hyper_file_sql(file_name, sql_text)
    content = {"table": table_data[0:5], "columns": columns }
    return jsonify(content)


@home.route('/get-hyper-tables')
def getOldHyperTables():
    target=os.path.join(UPLOAD_FOLDER)
    path, dirs, files = next(os.walk(target))
    file_count = len(files)
    response = []
    count = 0
    for file in files:
        filename_str = file.split('.')[0]
        extention = file.split('.')[-1]
        if extention == 'hyper':
            count = count + 1
            key_value = {"key": count, "value": filename_str}
            response.append(key_value)
    return jsonify(response)

@home.route('/upload', methods=['POST'])
def dashBoard():
    target=os.path.join(UPLOAD_FOLDER)
    if not os.path.isdir(target):
        os.mkdir(target)
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    extention = filename.split('.')[-1]
    destination = "\\".join([target, filename])
    file.save(destination)
    filename_str = filename.split('.')[0]
    filename_csv = filename_str + ".csv"
    csv_destination = "\\".join([target, filename_csv])
    read_file = pd.DataFrame()
    if extention in ["xlsx", "xls"]:
        read_file = pd.read_excel(destination)
        read_file.to_csv(csv_destination, index = None, header=True)
    else:
        read_file = pd.read_csv(csv_destination)

    session['uploadFilePath'] = csv_destination

    table_def_list = []
    cols_list = []
    for col in read_file:
        cols_list.append(col)
        if read_file[col].dtype == "object":
            table_def_list.append(TableDefinition.Column(col, SqlType.text(), NOT_NULLABLE))
        elif read_file[col].dtype == "int64":
            table_def_list.append(TableDefinition.Column(col, SqlType.big_int(), NOT_NULLABLE))
        elif read_file[col].dtype == "float64":
            table_def_list.append(TableDefinition.Column(col, SqlType.double(), NOT_NULLABLE))
        else:
            table_def_list.append(TableDefinition.Column(col, SqlType.text(), NOT_NULLABLE))

    table_def = TableDefinition(
        table_name="HYPERTABLE",
        columns=table_def_list
    )

    run_create_hyper_file_from_csv(filename_str, csv_destination, table_def)

    response="File " + filename_csv + " uploaded successfully"

    return jsonify({'response': response})
