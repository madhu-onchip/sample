/*
*********************************************************************************************************
*
*                (c) Copyright 2009-2010 OnChip Technologies India Pvt. Ltd. Hyderabad, INDIA
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



function Process() {
   this.processId = 0 ;
   this.requestId = ++Process.requestId;
   this.createCallback = null;
   this.stdOutCallback = null;
   this.stdErrorCallback = null;
   this.exitCallback = null;
   this.writeCallback = null; 
   this.writeContext = null;
   this.context = null;
   
   this.write = function (text, writeCallback, writeContext) {
		
		var processRequest = {	  
			operation: "process_write",
			text: text,
			processId: this.processId,
	   };
	   	   
	   var dispatchObject = {
		   object: this,
		   callback: Process.callback,
	   }

	   this.writeCallback = writeCallback;
	   this.writeContext = writeContext;
	   
	   dispatch("ProcessOperations",JSON.stringify(processRequest),dispatchObject);   
	}
	
    this.kill = function () {
		
		var processRequest = {	  
			operation: "process_kill",
			processId: this.processId,
	   };
	   	   
	   var dispatchObject = {
		   object: this,
		   callback: null	   
	   }
	   
	   dispatch("ProcessOperations",JSON.stringify(processRequest),dispatchObject);
	}

   
}
Process.objects = [];

Process.run = function (command, argString, createCallback, stdOutCallback, stdErrorCallback, exitCallback, workingDir, context) {
	
	if ((command == null) || (command == undefined)) {
	    return false;	
	}

	var p = new Process();
	p.createCallback = createCallback;
	p.stdOutCallback = stdOutCallback;
	p.stdErrorCallback = stdErrorCallback;
	p.exitCallback = exitCallback;
	p.context = context;
	
	var processRequest = {	  
        operation: "process_run",
        command: command,
        workingDirectory: workingDir,
		argString: argString,
   };
   
   Process.objects.push(p);
   
   var dispatchObject = {
	   object: p,
       callback: Process.callback	   
   }
   
   dispatch("ProcessOperations",JSON.stringify(processRequest),dispatchObject);   
}

Process.launch = function (command, argString, createCallback, stdOutCallback, stdErrorCallback, exitCallback, workingDir, context) {

    if ((command == null) || (command == undefined)) {
        return false;
    }

    var p = new Process();
    p.createCallback = createCallback;
    p.stdOutCallback = stdOutCallback;
    p.stdErrorCallback = stdErrorCallback;
    p.exitCallback = exitCallback;
    p.context = context;

    var processRequest = {
        operation: "process_launch",
        command: command,
        workingDirectory: workingDir,
        argString: argString,
    };

    Process.objects.push(p);

    var dispatchObject = {
        object: p,
        callback: Process.callback
    }

    dispatch("ProcessOperations", JSON.stringify(processRequest), dispatchObject);
}

Process.cmd = function (command, argString, createCallback, stdOutCallback, stdErrorCallback, exitCallback, workingDir, context) {

    if ((command == null) || (command == undefined)) {
        return false;
    }

    var p = new Process();
    p.createCallback = createCallback;
    p.stdOutCallback = stdOutCallback;
    p.stdErrorCallback = stdErrorCallback;
    p.exitCallback = exitCallback;
    p.context = context;

    var processRequest = {
        operation: "process_cmd",
        command: command,
        workingDirectory: workingDir,
        argString: argString,
    };

    Process.objects.push(p);

    var dispatchObject = {
        object: p,
        callback: Process.callback
    }

    dispatch("ProcessOperations", JSON.stringify(processRequest), dispatchObject);
}


Process.callback = function(name,json,process) {

   var processResponse = JSON.parse(json);
 	
   switch (processResponse.operation) {
       case "process_run":
       case "process_cmd":
       case "process_launch":
	   process.processId = processResponse.processId;
	   if (process.createCallback) {
		   process.createCallback(process, process.context);
	   }
	   break;
	    
	   case  "process_write":
	       if (process.writeCallback) {
	           process.writeCallback(process, process.writeContext);
	       }
	       break;
	 }
}


stdOutCallback = function (processId, output) {
	var process = null;
	$.grep(Process.objects, function (p,i) {
		if (p.processId == processId) {
			process = p;
			return true;
		}
		return true;
	});
	if ((process != null) && (process.stdOutCallback != null)) {
		process.stdOutCallback(output,process, process.context);
	}
}



stdErrorCallback = function(processId, errorOutput) {
	var process = null;
	$.grep(Process.objects, function (p,i) {
		if (p.processId == processId) {
			process = p;
			return true;
		}
		return true;
	});

	if ((process != null) && (process.stdErrorCallback != null)) {
		process.stdErrorCallback(errorOutput,process, process.context);
	}
}


exitCallback = function(processId) {
	var process = null;
	Process.objects = $.grep(Process.objects, function (p,i) {
		if (p.processId == processId) {
			process = p;
			return false;
		}
		return true;
	});
	
	if ((process != null) && (process.exitCallback != null)) {
		process.exitCallback(process, process.context);
	}
}