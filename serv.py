# encoding: UTF-8

import tornado.httpserver
from OpenSSL import SSL
import tornado.ioloop
import tornado.web
import tornado.options
import psycopg2
import re
import os
import tempfile
import requests
import json
from datetime import datetime, timedelta
from def_init import *
from tornado.options import define, options

# Define options
define("port", default=8888, help="run on the given port", type=int)
# BDD Configuration
define("pgsql_host", default="127.0.0.1:5432", help="database host")
define("pgsql_database", default="anavevodb", help="database name")
define("pgsql_user", default="postgres", help="database user")
define("pgsql_password", default="root", help="database password")

# Define path to library directory
#path_data = "data/"
path_data = "C:/Projets/anavevo/static/data/"
path_library = os.path.join(path_data, "library/")

# Path to define the url used
#path_url = "https://v-anavevo.upf.pf"
path_url = "http://localhost:8888"

# Define the static path for css, js, img files
#path_static = "static/"
path_static = "C:/Projets/anavevo/static/"

# Defini the html path for html files
#path_html = "html/"
path_html = "C:/Projets/anavevo/html/"

class LibraryHandler(tornado.web.RequestHandler):
    def get(self):
        
        label_user = getCurrentCookie(self)
        
        dic_general = {}
        
        list_collection_dir = listRepertoir(path_library + "collection/")
        
        for collection_dir in list_collection_dir :
            dic_general[collection_dir] = {}
            pathDirectoryCollection = getPathDirectory(path_library, collection_dir, "collection")
            
            list_item_dir = listRepertoir(pathDirectoryCollection + "/item/")
            
            for item_dir in list_item_dir :
                dic_general[collection_dir][item_dir] = {}
                pathDirectoryItem = getPathDirectory(pathDirectoryCollection, item_dir, "item")
                
                list_essence_dir = listRepertoir(pathDirectoryItem + "/essence/")
                
                for essence_dir in list_essence_dir :
                    dic_general[collection_dir][item_dir][essence_dir] = {}
                
        print(dic_general)
        
        strHTMLPath = os.path.join(path_html, "library.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic_general=dic_general)

class CollectionHandler(tornado.web.RequestHandler):
    def get(self, idCollection):

        label_user = getCurrentCookie(self)
        idCollection = idCollection[:-4] # Supr ".col"

        pathDirectoryCollection = getPathDirectory(path_library, idCollection, "collection")
               
        dicCollection = dictJSONFile(pathDirectoryCollection + "/" + str(idCollection) + ".json")
        
        dic_general = {}
                
        list_item_dir = listRepertoir(pathDirectoryCollection + "/item/")
        
        for item_dir in list_item_dir :
            dic_general[item_dir] = {}
            pathDirectoryItem = getPathDirectory(pathDirectoryCollection, item_dir, "item")
            
            list_essence_dir = listRepertoir(pathDirectoryItem + "/essence/")
            
            for essence_dir in list_essence_dir :
                dic_general[item_dir][essence_dir] = {}
        
        strHTMLPath = os.path.join(path_html, "collection.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic_general=dic_general, dicCollection=dicCollection, idCollection=idCollection)

class ItemHandler(tornado.web.RequestHandler):
    def get(self, idCollection, idItem):

        label_user = getCurrentCookie(self)
        idItem = idItem[:-4] # Supr ".ite"
        print("item")
        print(idCollection)
        print(idItem)

        pathDirectoryCollection = getPathDirectory(path_library, idCollection, "collection")
        pathDirectoryItem = getPathDirectory(pathDirectoryCollection, idItem, "item")

        dicCollection = dictJSONFile(pathDirectoryCollection + "/" + str(idCollection) + ".json")
        dicItem = dictJSONFile(pathDirectoryItem + "/" + str(idItem) + ".json")

        titleCollection = getTitleFromDict(dicCollection, "collection")

        list_essence_dir = listRepertoir(pathDirectoryItem + "/essence/")
        
        strHTMLPath = os.path.join(path_html, "item.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic = dicItem, list_essence_dir = list_essence_dir, idCollection=idCollection, idItem=idItem, titleCollection=titleCollection)

class EssenceHandler(tornado.web.RequestHandler):
    def get(self, idCollection, idItem, idEssence):

        label_user = getCurrentCookie(self)
        idEssence = idEssence [:-4] # Supr ".ess"
        print("essence")
        #print(idCollection)
        #print(idItem)
        #print(idEssence)

        pathDirectoryCollection = getPathDirectory(path_library, idCollection, "collection")
        pathDirectoryItem = getPathDirectory(pathDirectoryCollection, idItem, "item")
        pathDirectoryEssence = getPathDirectory(pathDirectoryItem, idEssence, "essence")

        dicCollection = dictJSONFile(pathDirectoryCollection + "/" + str(idCollection) + ".json")
        dicItem = dictJSONFile(pathDirectoryItem + "/" + str(idItem) + ".json")
        dicEssence = dictJSONFile(pathDirectoryEssence + "/" + str(idEssence) + ".json")

        titleCollection = getTitleFromDict(dicCollection, "collection")
        titleItem = getTitleFromDict(dicItem, "item")
        
        essence = listEssenceFile(pathDirectoryEssence + "/")
 
        if essence is not None :
            if essence.endswith((".mp3")) :
                meta = mpAttributes(pathDirectoryEssence + "/" + essence)
                dicEssence.update(meta)
        else :
            essence = None

        print(path_url)
        
        strHTMLPath = os.path.join(path_html, "essence.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic=dicEssence, idCollection=idCollection, idItem=idItem, 
        idEssence=idEssence, name=essence, titleCollection=titleCollection, titleItem=titleItem)

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        label_user = getCurrentCookie(self)
        
        strHTMLPath = os.path.join(path_html, "login.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, username=None, password=None, dicError=None)

    def post(self):
        label_user = getCurrentCookie(self)
    
        username = self.get_argument("username")
        password = self.get_argument("password")

        print("username"+username)
        print("password"+password)

        dicError = {"username-errors": None,
                    "password-errors": None}
        
            
        connection = psycopg2.connect(
                database = "anavevodb",
                user = "postgres",
                password = "root",
                host = "localhost",
                port = "5432")
            
        connection.set_session(readonly=True)

        try :
            cursor = connection.cursor()

            sql_query = "SELECT COUNT(*) FROM papareo.user WHERE username = %s"

            # Encodage + hash username à faire ?
            cursor.execute(sql_query, (username,))

            int_count = cursor.fetchone()[0]

            booCheckUsernameExist = False
            booCheckPasswordCorrect = False

            if int_count == 0 :
                dicError["username-errors"] = "L'identifiant saisi n'existe pas."
            elif int_count == 1 :
                print("utilisateur trouve")
                booCheckUsernameExist = True
            else :
                dicError["username-errors"] = "L'identifiant saisi existe en plusieurs fois, merci de contacter le support."

            if booCheckUsernameExist == True :
                sql_query = "SELECT id, username, firstname, lastname FROM papareo.user WHERE username = %s AND password = %s"

                # Encodage + hash password à faire
                cursor.execute(sql_query, (username, password))
                print("query:")
                print(cursor.query)
                #int_count = cursor.fetchone()[0]
                int_count = cursor.rowcount
                if int_count == 0 :
                    print("password incorrect")
                    dicError["password-errors"] = "Le mot de passe est incorrect."
                elif int_count == 1 :
                    print("password correct")
                    booCheckPasswordCorrect = True
                else :
                    print("plusieurs utilisateurs trouves, erreur")
                    dicError["password-errors"] = "Plusieurs utilisateurs trouvés, merci de contacter le support."

                if booCheckPasswordCorrect == True :
                    # Create a session

                    #session = requests.Session()
                    dicSession = {"username": username, "password": password}
                    #url = "localhost:8888/login"
                    #resp = session.post(url, data=dicSession)
                    
                    #self.session = session
                    #self.session.headers.update({'user-agent' : "test"})
                    #res = self.session.post("http://localhost:8888/logged", data = dicSession)
                    #print("res")
                    #print(res)
  
                    row = cursor.fetchone()
                    print(row)
                    userid = row[0]
                    username = row[1]
                    firstname = row[2]
                    lastname = row[3]
                    

                    userlabel = str(firstname) + " " + str(lastname)

                    date = datetime.now() + timedelta(minutes=1)
                    
                    print(date)
                    
                    timestamp = datetime.timestamp(date.now())
                    print(timestamp)
                    self.set_secure_cookie('userlabel', userlabel, expires_days=timestamp)
                    self.set_secure_cookie('sessionid', str(userid), expires_days=timestamp)
                    
                    self.redirect('/logged')
                    
                else :
                    
                    strHTMLPath = os.path.join(path_html, "login.html")       
                    self.render(strHTMLPath, path_url=path_url, label_user=label_user, username=username, password=password, dicError=dicError)
                    
                    
        except psycopg2.Error as e:
            print("Failed to get record from PostGre table: {}".format(e))

        finally:
            if connection:
                cursor.close()
                connection.close()
                print("PostGre connection is closed")

        print("dicError")
        print(dicError)
        

class LoggedHandler(tornado.web.RequestHandler):
    def get(self):
        label_user = getCurrentCookie(self)
        
        strHTMLPath = os.path.join(path_html, "logged.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user)
        print(self.get_secure_cookie('username'))

class LogoutHandler(tornado.web.RequestHandler):
    def get(self):
        self.clear_cookie("userlabel")
        
        strHTMLPath = os.path.join(path_html, "logout.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=None)
        
class HomeHandler(tornado.web.RequestHandler):

    def get(self):
        
        label_user = getCurrentCookie(self)

        strHTMLPath = os.path.join(path_html, "home.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, search_results = None)
        
    def post(self):

        label_user = getCurrentCookie(self)
        
        search_input_text = self.get_argument("search-input-text")

        try:
            connection = psycopg2.connect(
                database = "anavevodb",
                user = "postgres",
                password = "root",
                host = "localhost",
                port = "5432")
            
            connection.set_session(readonly=True)
            
            cursor = connection.cursor()

            sql_query = """SELECT papareo.ANAVEVO_SEARCH_FUNCTION(%s);"""

            cursor.execute(sql_query, (search_input_text,))

            html_row = cursor.fetchone()[0]
            print(html_row)
            
            sql_query = """SELECT papareo.ANAVEVO_JSONFY_FUNCTION(%s);"""
            
            cursor.execute(sql_query, ("collection",))          
            arrJSONCollection = cursor.fetchone()[0]
            
            cursor.execute(sql_query, ("item",))            
            arrJSONItem = cursor.fetchone()[0]
            
            cursor.execute(sql_query, ("essence",))          
            arrJSONEssence = cursor.fetchone()[0]


            if not os.path.exists(path_data) :
                os.mkdir(path_data)
            # define path to design all the directory
            parent_directory = path_library

            # create directory if not exist
            if not os.path.exists(parent_directory) :
                os.mkdir(parent_directory)

            # create structure directories and jsonfiles
            createJSONFile(arrJSONCollection, arrJSONItem, arrJSONEssence, None, None, "id", "identifier", parent_directory, "collection")     

        except psycopg2.Error as e:
            print("Failed to get record from PostGre table: {}".format(e))

        finally:
            if connection:
             cursor.close()
             connection.close()
             print("PostGre connection is closed")

        strHTMLPath = os.path.join(path_html, "home.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, search_results = html_row)


def getCurrentCookie(self) :

    label_user = None
    if self.get_secure_cookie("userlabel") is not None :
        label_user = self.get_secure_cookie("userlabel")

    return label_user

def createJSONFile(arrJSONElement, arrJSONItem, arrJSONEssence, parentElementId, parentEltId, eltId, eltName, path_directory_parent_element, directory_element) :
    
    if arrJSONElement is not None and len(arrJSONElement) > 0 : 
        for jsonElement in arrJSONElement :
            
            booProcess = True
            
            # Dans le cas d'un enfant, il faut vérifier si l'élément sur lequel on est a bien un sa réf parent id égale à l'id du parent
            if directory_element != "collection" :
                jsonParentElementId = jsonElement[parentEltId]           
                if jsonParentElementId != parentElementId :
                    booProcess = False
            
            # On fait le process si égal à true
            if booProcess == True :
                jsonElementId = jsonElement[eltId]
                jsonElementName = jsonElement[eltName]
                
                # Création du répertoire type s'il n'existe pas
                path_directory = os.path.join(path_directory_parent_element, directory_element, "")
                if not os.path.exists(path_directory) :
                    os.mkdir(path_directory)
                    
                if directory_element == "essence" :
                    element_name = str(jsonElementId)
                elif jsonElementName is not None :
                    element_name = str(jsonElementId) + "-" + str(jsonElementName)
                else:
                    element_name = str(jsonElementId)
                    
                                
                
                path_directory_element = os.path.join(path_directory, element_name, "")

                # Création du répertoire élément s'il n'existe pas
                if not os.path.exists(path_directory_element) :
                    os.mkdir(path_directory_element)
                    
                jsonElementFileName = str(path_directory_element) + (element_name) + ".json"
                
                # Si le fichier existe déjà on ne l'écrase pas
                booWriteFile = False
                if not os.path.exists(jsonElementFileName) :
                    booWriteFile = True
                else :
                    # Récupération  de la taille du fichier actuel
                    file_size = os.path.getsize(jsonElementFileName)

                    # Création d'un fichier temporaire avec la donnée en BDD pour obtenir la taille
                    temp_file = tempfile.NamedTemporaryFile(mode = "w+")
                    json.dump(jsonElement, temp_file)
                    temp_size = temp_file.tell()

                    # On remplace par le nouveau fichier
                    if file_size != temp_size :
                        booWriteFile = True
                    
                    # Et on flush le temporaire dans tous les cas
                    temp_file.flush()
                
                # Ecriture du fichier
                if booWriteFile == True :
                    with open(jsonElementFileName, 'w') as outfile_element :
                            json.dump(jsonElement, outfile_element)


                if directory_element == "collection" :
                    createJSONFile(arrJSONItem, arrJSONItem, arrJSONEssence, jsonElementId, "collection_id", "id", "identifier", path_directory_element, "item")    
                elif directory_element == "item" :
                    createJSONFile(arrJSONEssence, arrJSONEssence, arrJSONEssence, jsonElementId, "item_id", "id", "nom", path_directory_element, "essence") 
          

def make_app():
    
    settings = {
        "static_path": path_static,
        "cookie_secret": "MySuperCookie06",
        "login_url": "/login",
        "xsrf_cookies": True,
    }

    app = tornado.web.Application(handlers=[
        # Les parenthèses dans les regex permettent de délimiter les id qui vont transiter à traver les url
        (r"/home", HomeHandler),
        (r"/login", LoginHandler),
        (r"/logged", LoggedHandler),
        (r"/logout", LogoutHandler),
        (r"/library", LibraryHandler),
        (r"/library/(.*\.col$)", CollectionHandler),
        (r"/library/(.*)/(.*\.ite$)", ItemHandler),
        (r"/library/(.*)/(.*)/(.*\.ess$)", EssenceHandler),
        ], **settings)

    return app
    
if __name__ == "__main__":

    app = make_app()
    
    http_server = tornado.httpserver.HTTPServer(app)

    http_server.listen(options.port)
    print("The server is listening on port " + str(options.port))
    tornado.ioloop.IOLoop.current().start()
