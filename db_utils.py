import psycopg2
import psycopg2.extras
import urlparse

urlparse.uses_netloc.append("postgres")

class DBconnector(object):
    def __init__(self, connection_string):
        super(DBconnector, self).__init__()
        url = urlparse.urlparse(connection_string)
        self.conn = psycopg2.connect(
            database=url.path[1:],
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )

    def query(self, query, params=()):
        cur = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query, params)
        self.conn.commit()
        return cur.fetchall()

    def insert(self, query, params=()):
        cur = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query, params)
        self.conn.commit()
        
    def update(self, query, params=()):
        cur = self.conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        cur.execute(query, params)
        self.conn.commit()
# import sqlite3
#
# def initialize():
#     sqlite_file = 'my_first_db.sqlite'    # name of the sqlite database file
#     table_name1 = 'my_table_1'  # name of the table to be created
#     table_name2 = 'my_table_2'  # name of the table to be created
#     new_field = 'my_1st_column' # name of the column
#     field_type = 'INTEGER'  # column data type
#
#     # Connecting to the database file
#     conn = sqlite3.connect(sqlite_file)
#     c = conn.cursor()
#
#     # Creating a new SQLite table with 1 column
#     c.execute('CREATE TABLE {tn} ({nf} {ft})'\
#             .format(tn=table_name1, nf=new_field, ft=field_type))
#
#     # Creating a second table with 1 column and set it as PRIMARY KEY
#     # note that PRIMARY KEY column must consist of unique values!
#     c.execute('CREATE TABLE {tn} ({nf} {ft} PRIMARY KEY)'\
#             .format(tn=table_name2, nf=new_field, ft=field_type))
#
#     # Committing changes and closing the connection to the database file
#     conn.commit()
#     conn.close()
