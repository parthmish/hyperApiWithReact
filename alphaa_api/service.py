from pathlib import Path
from tableauhyperapi import HyperProcess, Telemetry, \
    Connection, CreateMode, \
    NOT_NULLABLE, NULLABLE, SqlType, TableDefinition, \
    Inserter, \
    TableName, \
    escape_name, escape_string_literal, \
    HyperException, ResultSchema

UPLOAD_FOLDER = r'C:\\Users\\User-16\\Desktop\\Alphaa Project\\data'

def run_read_data_from_existing_hyper_file(file_name):
    path_str = UPLOAD_FOLDER + "\\" + file_name
    path_to_source_database = path_str

    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:

        # Connect to existing Hyper file file_name.
        with Connection(endpoint=hyper.endpoint,
                        database=path_to_source_database) as connection:
            table_name = TableName("HYPERTABLE")
            table_definition = connection.catalog.get_table_definition(name=table_name)
            table_cols = []
            for column in table_definition.columns:
                col_name = str(column.name)
                table_cols.append(col_name[1:-1])

            rows_in_table = connection.execute_list_query(query=f"SELECT * FROM {table_name}")
            rows_in_table_dict = []
            for row in rows_in_table:
                row_dict = {}
                row_dict["pk"] = row[0]
                row_dict["value"] = row
                rows_in_table_dict.append(row_dict)
            
            return rows_in_table_dict, table_cols

def run_read_data_from_existing_hyper_file_sql(file_name, sql_query):
    path_str = UPLOAD_FOLDER + "\\" + file_name
    path_to_source_database = path_str
    
    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:

        # Connect to existing Hyper file file_name.
        with Connection(endpoint=hyper.endpoint,
                        database=path_to_source_database) as connection:
            table_name = TableName("HYPERTABLE")
            table_definition = connection.catalog.get_table_definition(name=table_name)
            table_cols = []
            rows_in_table = []

            with connection.execute_query(sql_query) as result:
                for row in result:
                    rows_in_table.append(row)
                for column in result.schema.columns:
                    col_name = str(column.name)
                    table_cols.append(col_name[1:-1])

            rows_in_table_dict = []
            for row in rows_in_table:
                row_dict = {}
                row_dict["pk"] = row[0]
                row_dict["value"] = row
                rows_in_table_dict.append(row_dict)

            return rows_in_table_dict, table_cols
            
def run_create_hyper_file_from_csv(filename, csv_destination, table_def):
    print("EXAMPLE - Load data from CSV into table in new Hyper file")
    path_str = UPLOAD_FOLDER + "\\" + filename + ".hyper"
    path_to_database = Path(path_str)
    process_parameters = {
        # Limits the number of Hyper event log files to two.
        "log_file_max_count": "2",
        # Limits the size of Hyper event log files to 100 megabytes.
        "log_file_size_limit": "100M"
    }

    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU, parameters=process_parameters) as hyper:

        connection_parameters = {"lc_time": "en_US"}

        with Connection(endpoint=hyper.endpoint,
                        database=path_to_database,
                        create_mode=CreateMode.CREATE_AND_REPLACE,
                        parameters=connection_parameters) as connection:
            connection.catalog.create_schema('HYPERTABLE')
            connection.catalog.create_table(table_definition=table_def)

            path_to_csv = str(csv_destination)
            count_in_customer_table = connection.execute_command(
                command=f"COPY {table_def.table_name} from {escape_string_literal(path_to_csv)} with "
                f"(format csv, NULL 'NULL', delimiter ',', header)")


def run_update_data_in_existing_hyper_file(file_name, row_id, update_col_name, col_value):
    
    path_str = UPLOAD_FOLDER + "\\" + file_name
    path_to_source_database = path_str

    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:

        # Connect to existing Hyper file file_name.
        with Connection(endpoint=hyper.endpoint,
                        database=path_to_source_database) as connection:

            table_name = TableName("HYPERTABLE")
            table_definition = connection.catalog.get_table_definition(name=table_name)
            table_cols = []
            for column in table_definition.columns:
                col_name = str(column.name)
                table_cols.append(col_name[1:-1])

            row_count = connection.execute_command(
                command=f"UPDATE {table_name} "
                f"SET \"{update_col_name}\" = {col_value} "
                f"WHERE {escape_name('Row ID')} = {row_id}")

            rows_in_table = connection.execute_list_query(query=f"SELECT * FROM {table_name}")
            rows_in_table_dict = []
            for row in rows_in_table:
                row_dict = {}
                row_dict["pk"] = row[0]
                row_dict["value"] = row
                rows_in_table_dict.append(row_dict)
            
            return rows_in_table_dict, table_cols

def run_delete_data_in_existing_hyper_file(file_name, row_id):
    
    path_str = UPLOAD_FOLDER + "\\" + file_name
    path_to_source_database = path_str

    with HyperProcess(telemetry=Telemetry.SEND_USAGE_DATA_TO_TABLEAU) as hyper:

        # Connect to existing Hyper file file_name.
        with Connection(endpoint=hyper.endpoint,
                        database=path_to_source_database) as connection:

            table_name = TableName("HYPERTABLE")
            table_definition = connection.catalog.get_table_definition(name=table_name)
            table_cols = []
            for column in table_definition.columns:
                col_name = str(column.name)
                table_cols.append(col_name[1:-1])

            row_count = connection.execute_command(
                command=f"DELETE FROM {table_name} "
                f"WHERE {escape_name('Row ID')} = {row_id}")

            rows_in_table = connection.execute_list_query(query=f"SELECT * FROM {table_name}")
            rows_in_table_dict = []
            for row in rows_in_table:
                row_dict = {}
                row_dict["pk"] = row[0]
                row_dict["value"] = row
                rows_in_table_dict.append(row_dict)
            
            return rows_in_table_dict, table_cols
