import xml.etree.ElementTree as ET
import os
import json
from PIL import Image
from PIL.ExifTags import TAGS
from tinytag import TinyTag
import psycopg2

# Retourne le JSON d'un fichier JSON sous forme de dict
def dictJSONFile(pathElt) :
        #print(pathElt)
        #print(os.path.exists(pathElt))
        with open(pathElt) as json_file :
                dic = json.load(json_file)
        #print(dic)
        return dic

# Retourne l'essence du répertoire de l'essence (exclu le JSON)
def listEssenceFile(path) :
        list_essence = None
        for path in os.listdir(path) :
                if not path.endswith(".json") :
                        list_essence = path
                        
        return list_essence

# Return path directory of id element given
def getPathDirectory(parentPath, idElement, typeElement):

    pathDirectory = os.path.join(parentPath, typeElement, idElement)

    #print("pathdi")
    #print(pathDirectory)
    return pathDirectory

# Return title element from dictionnary
def getTitleFromDict(dicElement, typeElement) :

    idElement = dicElement["id"]
    titleElement = dicElement["title"]

    if titleElement is not None :
        return titleElement
    else :
        if typeElement == "collection" :
                return "Collection - " + str(idElement)
        elif typeElement == "item" :
                return "Item - " + str(idElement)

# Retourne la liste des sous-répertoires d'un chemin 
def listRepertoir(path) :
        listDir = []
        if os.path.exists(path) == True :
                listDir = sorted(os.listdir(path))

        return listDir         

def imageAttributes(imagePath):

	imageObject = Image.open(imagePath)

	meta = { 
		"Format" : imageObject.format,
		"Mode" : imageObject.mode,
		"x size (in px)" : imageObject.size[0], 
		"y size (in px)" : imageObject.size[1]
	}

	supr = []
	for key in meta.keys() :
		if meta[key] == None :
			supr.append(key)
	
	for key in supr :
		del meta[key]

	return meta

def mpAttributes(contentPath) :

	tag = TinyTag.get(contentPath)

	meta = { 
		"Bit rate (in Kbit/s)" : tag.bitrate, 
		"Length (in s)" : tag.duration, 
		"Size (in byts)" : tag.filesize, 
		"Sample rate (in Hz)" : tag.samplerate, 
		"Title" : tag.title, 
		"Year" : tag.year
	}
	supr = []
	for key in meta.keys() :
		if meta[key] == None :
			supr.append(key)
	
	for key in supr :
		del meta[key]

	return meta


