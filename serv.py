# encoding: UTF-8

import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.options
import psycopg2
from configparser import ConfigParser
import re
import os
import hashlib
import base64
import tempfile
import requests
import json
import psycopg2.extras
import uuid
from datetime import datetime, date, timedelta
from def_init import *
from tornado.options import define, options

# Define options
define("port", default=8888, help="run on the given port", type=int)

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

# Define the html path for html files
#path_html = "html/"
path_html = "C:/Projets/anavevo/html/"

#Define the conf path for config files
path_dbconfig = "C:/Projets/anavevo/conf/"
#path_dbconfig = "conf/"
configdb_filename = "database.conf"
path_dbconfig = os.path.join(path_dbconfig, configdb_filename)

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("sessionid")

class LibraryHandler(BaseHandler):
    def get(self):
        
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
        
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

        strHTMLPath = os.path.join(path_html, "library.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic_general=dic_general)

class CollectionHandler(BaseHandler):
    def get(self, idCollection):

        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
            
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

class ItemHandler(BaseHandler):
    def get(self, idCollection, idItem):

        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
            
        idItem = idItem[:-4] # Supr ".ite"

        pathDirectoryCollection = getPathDirectory(path_library, idCollection, "collection")
        pathDirectoryItem = getPathDirectory(pathDirectoryCollection, idItem, "item")

        dicCollection = dictJSONFile(pathDirectoryCollection + "/" + str(idCollection) + ".json")
        dicItem = dictJSONFile(pathDirectoryItem + "/" + str(idItem) + ".json")

        titleCollection = getTitleFromDict(dicCollection, "collection")

        list_essence_dir = listRepertoir(pathDirectoryItem + "/essence/")
        
        strHTMLPath = os.path.join(path_html, "item.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic = dicItem, list_essence_dir = list_essence_dir, idCollection=idCollection, idItem=idItem, titleCollection=titleCollection)

class EssenceHandler(BaseHandler):
    def get(self, idCollection, idItem, idEssence):

        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
            
        idEssence = idEssence [:-4] # Supr ".ess"

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

        strHTMLPath = os.path.join(path_html, "essence.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, dic=dicEssence, idCollection=idCollection, idItem=idItem, 
        idEssence=idEssence, name=essence, titleCollection=titleCollection, titleItem=titleItem)
      
class LoginHandler(BaseHandler):

    def get(self):
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
        
        strHTMLPath = os.path.join(path_html, "login.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, username=None, password=None, dicError=None)

    def post(self):
    
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
    
        username = self.get_argument("username")
        password = self.get_argument("password")
        ip_user = self.request.remote_ip
        
        dicUser = {}
        dicUser["username"] = username
        dicUser["password"] = password
        dicUser["ip_user"] = ip_user


        dicError = {"username-errors": None,
                    "password-errors": None}
        
        dicGeneral = {}
        dicGeneral["dicError"] = dicError
        dicGeneral["dicUser"] = dicUser
       
        # Check user connection
        dicGeneral = checkUserLoginConnexion(dicGeneral)
        
        booCheckPasswordCorrect = dicGeneral["booCheckPasswordCorrect"]
        dicUser = dicGeneral["dicUser"]
        dicSession = None
        if dicGeneral["dicSession"] is not None :
            dicSession = dicGeneral["dicSession"]
        dicError = dicGeneral["dicError"]

        if booCheckPasswordCorrect == True :
            # The label of the user connected to display
            firstname = dicUser["firstname"]
            lastname = dicUser["lastname"]
            
            userlabel = str(firstname) + " " + str(lastname)
            
            cookie_session_id = dicSession["cookie_session_id"]
            date_expiration_timestamp = dicSession["date_expiration_timestamp"]
            
            timestamp_expiration = float(date_expiration_timestamp.timestamp())
            
            self.set_secure_cookie('userlabel', userlabel, expires=timestamp_expiration)
            self.set_secure_cookie('sessionid', str(cookie_session_id), expires=timestamp_expiration)
                        
            self.redirect('/logged')
                    
        else :
                    
            strHTMLPath = os.path.join(path_html, "login.html")       
            self.render(strHTMLPath, path_url=path_url, label_user=label_user, username=username, password=password, dicError=dicError)
        
class RegisterHandler(BaseHandler):
    def get(self):
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
        
        strHTMLPath = os.path.join(path_html, "register.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, username=None, password=None, confirmpassword=None, lastname=None, firstname=None, dicError=None)
        
    def post(self):

        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
            
        lastname = self.get_argument("lastname")
        firstname = self.get_argument("firstname")        
        username = self.get_argument("username")
        password = self.get_argument("password")
        confirmpassword = self.get_argument("confirmpassword")
        
        dicUser = {}
        dicUser["lastname"] = lastname
        dicUser["firstname"] = firstname
        dicUser["username"] = username
        dicUser["password"] = password
        dicUser["confirmpassword"] = confirmpassword
               
        dicError = {}
        dicError["lastname-errors"] = None
        dicError["firstname-errors"] = None
        dicError["username-errors"] = None
        dicError["password-errors"] = None
        dicError["confirmpassword-errors"] = None
        
        dicGeneral = {}
        dicGeneral["dicError"] = dicError
        dicGeneral["dicUser"] = dicUser
       
        # Check user connection
        dicGeneral = checkUserRegisterInformation(dicGeneral)

        booUserInformationHasError = dicGeneral["booUserInformationHasError"]
                           
        if booUserInformationHasError == False :
            
            setHashedPassword(dicGeneral)

            self.redirect('/registered')        
        else :
            strHTMLPath = os.path.join(path_html, "register.html")
            self.render(strHTMLPath, path_url=path_url, label_user=label_user, username=username, password=password, confirmpassword=confirmpassword, lastname=lastname, firstname=firstname, dicError=dicError)
        
class RegisteredHandler(BaseHandler):
    def get(self):
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
        
        strHTMLPath = os.path.join(path_html, "registered.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user)
        
class LoggedHandler(BaseHandler):
    def get(self):
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
        
        strHTMLPath = os.path.join(path_html, "logged.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user)
        print(self.get_secure_cookie('username'))

class LogoutHandler(BaseHandler):
    def get(self):
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
            
        self.clear_cookie("userlabel")
        self.clear_cookie("sessionid")
        
        strHTMLPath = os.path.join(path_html, "logout.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=None)
        
class HomeHandler(BaseHandler):

    def get(self):
        
        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)

        strHTMLPath = os.path.join(path_html, "home.html")
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, search_results = None, search_input_text=None)
        
    def post(self):

        if not self.current_user :
            label_user = None
        else :
            label_user = getLabelUserFromCurrentCookie(self)
        
        search_input_text = self.get_argument("search-input-text")
        
        try:
            connection = setConnection()
            
            connection.set_session(readonly=True)
            
            cursor = connection.cursor()

            displayDatabaseInformation(cursor)
            
            sql_query = """SELECT papareo.ANAVEVO_SEARCH_FUNCTION(%s);"""

            cursor.execute(sql_query, (search_input_text,))

            html_row = cursor.fetchone()[0]
            #print(html_row)
            
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
        
        self.render(strHTMLPath, path_url=path_url, label_user=label_user, search_results = html_row, search_input_text=search_input_text)

def setConnection():
    # Connect to the postgreSQL database server
    
    connection = None

    params = getConfigDictionnaryFromConfigFile(path_dbconfig, "postgresql")
    
    print('Connecting to the PostgreSQL database...')
    connection = psycopg2.connect(**params)
            
    return connection

def displayDatabaseInformation(cursor):

        # execute a statement
        print('PostgreSQL database version:')
        cursor.execute('SELECT version()')

        # display the PostgreSQL database server version
        db_version = cursor.fetchone()
        print(db_version)
        
def getConfigDictionnaryFromConfigFile(fileName, section):
    #Create a parser
    parser = ConfigParser()
    
    parser.read(fileName)

    dicDB = {}
    
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            dicDB[param[0]] = param[1]
    
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, fileName))
    
    return dicDB

def checkUserRegisterInformation(dicGeneral):

    dicUser = dicGeneral["dicUser"]
    dicError = dicGeneral["dicError"]
    
    lastname = dicUser["lastname"]
    firstname = dicUser["firstname"]
    username = dicUser["username"]
    password = dicUser["password"]
    confirmpassword = dicUser["confirmpassword"]
    
    booUserInformationHasError = False
    
    # Regex for the name, must be between 3 and 30, and have only characters, authorize , . ' -
    regex_name = re.compile("^(?=.{3,29}$)[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$")
    
    # Verify lastname validity
    if re.fullmatch(regex_name, lastname): 
        print("valid lastname")
    else :
        print("non valid lastname")
        dicError["lastname-errors"] = "Le nom est invalide."
        booUserInformationHasError = True
    
    # Verify firstname validity        
    if re.fullmatch(regex_name, firstname): 
        print("valid firstname")
    else :
        print("non valid firstname")
        dicError["firstname-errors"] = "Le prénom est invalide."
        booUserInformationHasError = True
        
    # Verify email validity
    regex_email = re.compile(r'([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+')
    if re.fullmatch(regex_email, username):
        print("Valid email")
    else:
        print("Invalid email")
        dicError["username-errors"] = "L'email saisie est invalide."
        booUserInformationHasError = True
    
    # Verify strength password
    # TODO
    
    # Verify confirm password equal to password  
    if password != confirmpassword :
        print("password not identical")
        dicError["confirmpassword-errors"] = "Le mot de passe n'est pas identique."
        booUserInformationHasError = True
        
    try :
    
        connection = setConnection()
        connection.set_session(readonly=True)
        cursor = connection.cursor()
        displayDatabaseInformation(cursor)
        
        sql_query = "SELECT COUNT(*) FROM papareo.user WHERE username = %s"
        
        cursor.execute(sql_query, (username,))

        int_count = cursor.fetchone()[0]
                
        if int_count > 0 :
            print("username non disponible")
            dicError["username-errors"] = "L'identifiant saisi est déjà pris."
            booUserInformationHasError = True
        else :
            print("username disponible")
            
    except psycopg2.Error as e:
        print("Failed to get record from PostGre table: {}".format(e))

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostGre connection is closed")  

    dicGeneral["dicUser"] = dicUser   
    dicGeneral["dicError"] = dicError
    dicGeneral["booUserInformationHasError"] = booUserInformationHasError
    
    return dicGeneral

def setHashedPassword(dicGeneral):

    dicUser = dicGeneral["dicUser"]
    
    username = dicUser["username"]
    password = dicUser["password"]
    firstname = dicUser["firstname"]
    lastname = dicUser["lastname"]
    
    # Define the salt for the user password
    salt_password = os.urandom(32)

    # Define the hash key for the user password
    key_password = hashlib.pbkdf2_hmac('sha256', password.encode('UTF-8'), salt_password, 100000)                
    
    # Define the byte password to store
    storage_password = salt_password + key_password

    # Encode in base64 the hash password and convert it to a string               
    encode_password_64 = base64.b64encode(storage_password).decode('ascii')

    try:
        connection = setConnection()
        cursor = connection_user.cursor()
        displayDatabaseInformation(cursor)
        
        sql_query = "INSERT INTO papareo.user(username, password, firstname, lastname, date_creation, date_creation_timestamp, private_access) "
        sql_query += "VALUES (%s, %s, %s, %s, %s, %s, %s) "

        datetime_jour = datetime.now()
        
        cursor.execute(sql_query, (username, encode_password_64, firstname, lastname, datetime_jour, datetime_jour, 'True'))

        connection.commit()
    
    except psycopg2.Error as e:
        print("Failed to insert record from PostGre table: {}".format(e))

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostGre connection_user is closed")
    
def checkUserLoginConnexion(dicGeneral):

    dicSession = {}
    
    try :
    
        connection = setConnection()
        connection.set_session(readonly=True)
        cursor = connection.cursor()
        displayDatabaseInformation(cursor)
        
        # Encodage + hash username à faire ?
        dicUser = dicGeneral["dicUser"]
        username = dicUser["username"]
        
        booCheckPasswordCorrect = False
        booCheckMoreUsers = False
        
        dicError = dicGeneral["dicError"]

        sql_query = "SELECT id, password, firstname, lastname FROM papareo.user WHERE username = %s "

        # Encodage ou hash password à faire
        password = dicUser["password"]
        
        cursor.execute(sql_query, (username,))

        int_count = cursor.rowcount
                 
        if int_count != 1 :
            dicError["password-errors"] = "L'identifiant et/ou mot de passe saisis sont incorrects."
        else :
            row = cursor.fetchone()
            userid_bdd = row[0]
            encode_password_64 = row[1]
            firstname_bdd = row[2]
            lastname_bdd = row[3]
            
            # Retrieve password
            # Decode the BDD password in bytes
            decode_password_64 = base64.b64decode(encode_password_64.encode('ascii'))
            
            # Get the salt from BDD password, 32 is the length of the salt
            salt_from_storage = decode_password_64[:32] 
            
            # Get the key from BDD password
            key_from_storage = decode_password_64[32:]

            # Generate hash from password user gives in login, with the salt value from BDD password
            key_password_tocheck = hashlib.pbkdf2_hmac('sha256', password.encode('UTF-8'), salt_from_storage, 100000)                

            # Compare the two keys, if identical, password is correct
            if key_from_storage == key_password_tocheck :
                print("password correct")
                booCheckPasswordCorrect = True
            else :
                print("password incorrect")
                dicError["password-errors"] = "L'identifiant et/ou mot de passe saisis sont incorrects."
            
            if booCheckPasswordCorrect == True :
                # Add new values to dicUser                   
                dicUser["userid"] = userid_bdd
                dicUser["firstname"] = firstname_bdd
                dicUser["lastname"] = lastname_bdd
                
                # Set session
                dicSession = setSessionUserId(dicUser)

    except psycopg2.Error as e:
        print("Failed to get record from PostGre table: {}".format(e))

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostGre connection is closed")

    dicGeneral["dicUser"] = dicUser 
    dicGeneral["dicSession"] = dicSession    
    dicGeneral["dicError"] = dicError
    dicGeneral["booCheckPasswordCorrect"] = booCheckPasswordCorrect
     
    return dicGeneral

def setSessionUserId(dicUser):

    # Function to create a session
                    
    # Define the timestamp expiration of the cookie
    datetime_jour = datetime.now() 
    delta_expiration = timedelta(minutes=5)
    date_expiration = datetime_jour + delta_expiration

    # Need to register uuid before using in insert query postgres
    psycopg2.extras.register_uuid()

    # Generation the random id for cookie session
    random_cookie_session_id = uuid.uuid4()
            
    try :
    
        connection = setConnection()   
        cursor = connection.cursor()
        displayDatabaseInformation(cursor)
        
        sql_query = "INSERT INTO papareo.usersession (id_user, ip_user, date_creation, date_creation_timestamp, date_expiration, date_expiration_timestamp, cookie_session_id, active) "
        sql_query += "VALUES (%s, %s, %s, %s, %s, %s, %s, 'True') RETURNING cookie_session_id, date_expiration_timestamp; "
        
        cursor.execute(sql_query, (dicUser["userid"], dicUser["ip_user"], datetime_jour, datetime_jour, date_expiration, date_expiration, random_cookie_session_id))
    
        row_usersession = cursor.fetchone()       
        cookie_session_id = row_usersession[0]
        date_expiration_timestamp = row_usersession[1]
        
        connection.commit()
    
        print("cookie_session_id"+cookie_session_id)
        print("date_expiration_timestamp"+str(date_expiration_timestamp))
        
    except psycopg2.Error as e:
        print("Failed to insert record into PostGre table usersession: {}".format(e))

    finally:
        if connection:
            cursor.close()
            connection.close()
            print("PostGre connection is closed")
            
    dicSession = {}
    dicSession["cookie_session_id"] = cookie_session_id
    dicSession["date_expiration_timestamp"] = date_expiration_timestamp
    
    return dicSession

def getLabelUserFromCurrentCookie(self):

    label_user = None
    if self.get_secure_cookie("userlabel") is not None :
        label_user = self.get_secure_cookie("userlabel")

    return label_user

def createJSONFile(arrJSONElement, arrJSONItem, arrJSONEssence, parentElementId, parentEltId, eltId, eltName, path_directory_parent_element, directory_element):
    
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
        (r"/register", RegisterHandler),
        (r"/registered", RegisteredHandler),
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
