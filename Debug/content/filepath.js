/*
*********************************************************************************************************
*
*                (c) Copyright 2009-2015 OnChip Technologies India Pvt. Ltd. Hyderabad, INDIA
*                                           All rights reserved.
*
*               This file is protected by international copyright laws. This file can only be used in
*               accordance with a license and should not be redistributed in any way without written
*               permission by Onchip Technologies Corporation.
*
*                                            www.onchiptech.com
*
**************************************************************************************************************
*/

function FilePath(path) {
    
	this.fileName = null;
	this.fileExtension = null;
	this.folderName = null;
	this.folderPath = null;
	this.filePath = null;
	this.fileNameWithOutExtension = null;
	if ((path == null) || (path == undefined)) {
		return;
	}
	
	path = FilePath.normalize(path);
	if (!path) {
	    return;
	}

	this.filePath = path;
	var pathParts = this.filePath.split(/\/|\\/g);	    
	this.fileName = pathParts[pathParts.length - 1];
	if (pathParts.length > 1) {
		this.folderName = pathParts[pathParts.length - 2];
		this.folderPath = this.filePath.substring(0,this.filePath.length - this.fileName.length).replace(/\/$|\\$/, '');		
	}
	var nameParts = this.fileName.split('.');
	if (nameParts.length > 1) {
	    this.fileExtension = nameParts[nameParts.length - 1];
	} else if (nameParts.length == 1) {
		if (this.fileName.charAt(0) == '.') {
			this.fileExtension = nameParts[0];
		}		
	}
	this.fileNameWithOutExtension = nameParts[0];

	this.toString = function () {
	    return FilePath.normalize(this.folderPath + "/" + this.fileNameWithOutExtension + "." + this.fileExtension);
	}
}

FilePath.getAbsolutePath = function (basePath, relativePath) {
	
	if ((!basePath) || (!relativePath)) {
	    return null;	
	}
	
	basePath =FilePath.normalize(basePath.trim());
	relativePath = FilePath.normalize(relativePath.trim());
    if (!basePath) {
		return null;
	}   
   
    if (!relativePath) {
		return basePath;
    }
	
    var tempPath = basePath.replace(/\:$|\/$|\\$/, '');    // remove trailing : // \ characters if any present
	var tempPathParts = tempPath.split(/\/|\\/g);
	var parts = relativePath.split(/\/|\\/g);
	for (var i = 0; i < parts.length; i++) {
		if ((parts[i] != "..") && (parts[i] != ".")) {
			break;
		}
	}
	parts.splice(i,parts.length - i);
	if (parts.length >= tempPathParts.length) {
		return null;
	}
	if (parts.length == 0) {
	    return relativePath;
	}	
	i = 1;
	while ((parts.length >= i) && (tempPathParts.length >= i)) {		
        if (parts[parts.length - i] == "..") {
		    var upfolderName = tempPathParts[tempPathParts.length - i];
			tempPath = tempPath.replace(/\:$|\/$|\\$/, '');			
			tempPath = tempPath.substring(0,tempPath.length - upfolderName.length);					
		} else if (parts == ".") {
			
		} else {
			break;
		}	
		i++;
	} 	
	
	do {
		relativePath = relativePath.replace(/^\:|^\/|^\\/, '');
        parts = relativePath.split(/\/|\\/);
		if (parts.length > 0) {
			if (parts[0] == "..") {
				relativePath = relativePath.substring(2);
			} else if (parts[0] == ".") {
				relativePath = relativePath.substring(1);
			} else {
				break;
			}
		}
	} while(parts.length > 0);
	tempPath = tempPath.replace(/\:$|\/$|\\$/, '');
	return FilePath.normalize(tempPath + '/' + relativePath);
}



FilePath.getRelativePath = function (basePath, absolutePath) {
    if ((!basePath) || (!absolutePath)) {
        return null;
    }

	basePath = FilePath.normalize(basePath.trim());
	absolutePath = FilePath.normalize(absolutePath.trim());

    if (basePath == '') {
		return null;
	}   
   
    if (absolutePath == '') {
		return null;
	}
	
    basePath = basePath.replace(/\:$|\/$|\\$/, '');	
	var basePathParts = basePath.split(/\/|\\/g);
	var absolutePathParts = absolutePath.split(/\/|\\/g);
	var relativePath = "";
	for (var i = 0; (i < basePathParts.length) && (i < absolutePathParts.length); i++) {
	    if (absolutePathParts[i].toLowerCase() != basePathParts[i].toLowerCase()) {
			break;
		}
		absolutePath = absolutePath.substring(absolutePathParts[i].length).replace(/^\/|^\\/, '');		
	}
	if (i == 0) {
		return absolutePath;
	}
	if (i == basePathParts.length) {
		relativePath = "./";
	} else {
		for (;i < basePathParts.length; i++) {
		    relativePath += '../';
		}		
	}

	return FilePath.normalize(relativePath + absolutePath);
}


FilePath.normalize = function (path) {
    
    if (!path) {
        return null;
    }
    path = path.trim();
    if (!path) {
        return null;
    }

    var parts = path.split(/\/|\\/g).filter(function (p) {
        if (p) {
            return true;
        } else {
            return false;
        }
    });

    path = parts.join("/");

    var parts = path.split(/\/|\\/g);
    var tbeginparts = [].concat(parts);
    var tendparts = [].concat(parts);
    for (var i = 0; i < parts.length; i++) {
        if ((parts[i] == "..") || (parts[i] == ".")) {
            if (i > 0) {
                var rPath = tbeginparts.splice(i).join("/");
                var bPath = tendparts.splice(0, i).join("/");
                return FilePath.getAbsolutePath(bPath, rPath);
            }
        }
    }

    return path;

}

FilePath.compare = function (path1, path2)
{

    path1 = FilePath.normalize(path1);
    path2 = FilePath.normalize(path2);

	if ((path1 == null) || (path2 == null)) {
		return (false);
	}

	
	var pathParts1 = [];

	path1.split(/\/|\\/g).map(function (s) {
	    if (s != "") {
	        pathParts1.push(s);
	    }
	});

	var pathParts2 = [];
	path2.split(/\/|\\/g).map(function (s) {
	    if (s != "") {
	        pathParts2.push(s);
	    }
	});

	if (pathParts1.length != pathParts2.length) {
		return false;
	}
	
	var i = 0;
	for (i = 0; i < pathParts1.length; i++) {
	    if (pathParts1[i].toLowerCase() != pathParts2[i].toLowerCase()) {
			return false;
		}
	}  	
	return true;	
}