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




function FileOperations() {
	
}

FileOperations.selectFile = function(filter,callback,object) { 
   
   var fileRequest = {	  
        fileOperation: "select_file",
        fileText: null,
        filePath: [],
		fileError: null,
        fileFilter:filter
   };
   var fObject = {
       object: object,
	   callback: callback
	   
   };
   
   var dispatchObject = {
       object: fObject,
       sync: true,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);

};

FileOperations.selectFolder = function (callback, object) {

    var fileRequest = {
        fileOperation: "select_folder",
        fileText: null,
        filePath: [],
        fileError: null,
        fileFilter: null
    };
    var fObject = {
        object: object,
        callback: callback

    };

    var dispatchObject = {
        object: fObject,
        sync: true,
        callback: FileOperations.callback
    }

    dispatch("FileOperations", JSON.stringify(fileRequest), dispatchObject);

};
//swathi
FileOperations.extractFileData = function (src_filePath, offset, bytes, dst_filePath, callback, object) {

    var fileRequest = {
        fileOperation: "extract_file_data",
        fileText: null,
        filePath: [src_filePath, dst_filePath],
        fileError: null,
        fileFilter: null,
        fileOffset: offset,
        bytesCount: bytes
    };

    var fObject = {
        object: object,
        callback: callback
    };

    var dispatchObject = {
        object: fObject,
        callback: FileOperations.callback
    }

    dispatch("FileOperations", JSON.stringify(fileRequest), dispatchObject);
};

FileOperations.createFile = function(filePath,callback,object) { 
   
   var fileRequest = {	  
        fileOperation: "create_file",
        fileText: null,
        filePath: [filePath],
		fileError: null,
        fileFilter: null
   };
   
   var fObject = {
	   object: object,
	   callback: callback
   };
   
   var dispatchObject = {
	   object: fObject,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);
};
FileOperations.readFile = function(filePath,callback,object) { 
   
   var fileRequest = {	  
        fileOperation: "read_file",
        fileText: null,
        filePath: [filePath],
		fileError: null,
        fileFilter: null
   };
   
   var fObject = {
	   object: object,
	   callback: callback
   };
   
   var dispatchObject = {
	   object: fObject,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);
};

FileOperations.saveFile = function(filePath,fileText,callback,object) { 
   
   var fileRequest = {	  
        fileOperation: "save_file",
        fileText: fileText,
        filePath: [filePath],
		fileError: null,
        fileFilter: null
   };
   
   var fObject = {
	   object: object,
	   callback: callback
   };
   
   var dispatchObject = {
	   object: fObject,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);
};

FileOperations.saveFileAs = function(curFilePath,fileText,callback,object) { 
   
   var fileRequest = {	  
        fileOperation: "save_file_as",
        fileText: fileText,
        filePath: [curFilePath],
		fileError: null,
        fileFilter: null
   };
   
   var fObject = {
       object: object,
	   callback: callback
   };
   
   var dispatchObject = {
       object: fObject,
       sync: true,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);
};

FileOperations.copyFileAs = function (curFilePath, callback, object) {

    var fileRequest = {
        fileOperation: "copy_file_as",
        fileText: null,
        filePath: [curFilePath],
        fileError: null,
        fileFilter: null
    };

    var fObject = {
        object: object,
        callback: callback
    };

    var dispatchObject = {
        object: fObject,
        sync: true,
        callback: FileOperations.callback
    }

    dispatch("FileOperations", JSON.stringify(fileRequest), dispatchObject);
};

FileOperations.moveFile = function(srcFile, dstFile, callback, object) { 
   
   var fileRequest = {	  
        fileOperation: "move_file",
        fileText: null,
        filePath: [srcFile, dstFile],
		fileError: null,
        fileFilter: null
   };
   
   var fObject = {
	   object: object,
	   callback: callback
   };
   
   var dispatchObject = {
	   object: fObject,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);
};

FileOperations.createDirectory = function(filePath,failIfExists,callback,object) { 
   
   var fileRequest = {	  
        fileOperation: "create_directory",
        fileText: null,
        filePath: [filePath],
		fileError: null,
        fileFilter: null,
        failIfExists: failIfExists
   };
   
   var fObject = {
	   object: object,
	   callback: callback
   };
   
   var dispatchObject = {
	   object: fObject,
	   callback: FileOperations.callback 
   }
   
   dispatch("FileOperations",JSON.stringify(fileRequest),dispatchObject);
};

FileOperations.getProjectsDirectory = function (callback, object) {

    var fileRequest = {
        fileOperation: "get_projects_directory",
        fileError: null,
    };

    var fObject = {
        object: object,
        callback: callback
    };

    var dispatchObject = {
        object: fObject,
        callback: FileOperations.callback
    }

    dispatch("FileOperations", JSON.stringify(fileRequest), dispatchObject);
};


//swathi
FileOperations.callback = function(name,json,fObject) { 

   var fileResponse = JSON.parse(json);
   
   switch (fileResponse.fileOperation) {
	   case  "select_file":
	   var data = {
		   status:fileResponse.fileError,
		   filePaths: fileResponse.filePath,
		   object: fObject.object
	   }	   
	   fObject.callback(data);
	   break;

       case "select_folder":
           var data = {
               status: fileResponse.fileError,
               filePaths: fileResponse.filePath,
               object: fObject.object
           }
           fObject.callback(data);
           break;

	   case "create_file":
	   var data = {
		   status:fileResponse.fileError,
		   filePath: fileResponse.filePath[0],
		   object: fObject.object
	   }
	   fObject.callback(data);
	   break;

       case "extract_file_data":
           var data = {
               status: fileResponse.fileError,
               filePath: fileResponse.filePath[1],//destination file path will become output
               object: fObject.object
           }
           fObject.callback(data);
           break;
	   
	   case "read_file":
	   var data = {
		   status:fileResponse.fileError,
		   filePath: fileResponse.filePath[0],
		   fileText: fileResponse.fileText,
		   object: fObject.object
	   }
	   fObject.callback(data);
	   break;	   
	   case "save_file":
	   var data = {
		   status:fileResponse.fileError,
		   filePath: fileResponse.filePath[0],
		   object: fObject.object
	   }
	   fObject.callback(data);
	   break;
	   
	   case "save_file_as":
	   var data = {
		   status:fileResponse.fileError,
		   filePaths: [fileResponse.filePath[0],fileResponse.filePath[1]],
		   object: fObject.object
	   }
	   fObject.callback(data);
	   break;
	   
	   case "move_file":
	   var data = {
		   status:fileResponse.fileError,
		   filePaths: fileResponse.filePath,
		   object: fObject.object
	   }	   
	   fObject.callback(data);
	   break;	

	   case "create_directory":
	   var data = {
		   status:fileResponse.fileError,
		   filePath: fileResponse.filePath[0],
		   object: fObject.object
	   }
	   fObject.callback(data);
	   break;

       case "get_projects_directory":           
           var data = {
               status:fileResponse.fileError,
               filePath: fileResponse.filePath[0],
               object: fObject.object
           }
           fObject.callback(data);
           break;
	   
   }   
};


