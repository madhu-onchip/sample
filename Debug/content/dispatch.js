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

var dispatchMap = [];
var dispatchIdCount = 0;
var commandPending = false;

function dispatch(name, json, dispatchObject) {

    dispatchIdCount++;
    if (dispatchIdCount == 0) {
        dispatchIdCount++;
    }
    dispatchMap[dispatchIdCount] = { name: name, json: json, dispatchObject: dispatchObject };
    //disable_page();
    if (!commandPending) {
        commandPending = true;
        if (dispatchObject.sync) {
           
            nativeObj.processCommandSync(dispatchIdCount.toString(), name, json);
        } else {
            
            nativeObj.processCommand(dispatchIdCount.toString(), name, json);
        }
    }
}

function disable_page() {

    var blurDiv = document.createElement("div");
    blurDiv.id = "blurDiv";
    blurDiv.style.cssText = "position:absolute;&nbsp;top:0; right:0; width:100%; height:100%; z-index: 100; background-color: #000000; opacity:0; filter:alpha(opacity=0)";
    document.getElementsByTagName("body")[0].appendChild(blurDiv);
}

function enable_page() {
    var blurDiv = document.getElementById("blurDiv");
    blurDiv.parentNode.removeChild(blurDiv);
}

function dispatchCommmandResponse(dispatchId, name, json) {
    //enable_page();

    json = json.escapeSpecialChars();
    dispatchId = parseInt(dispatchId);
    var obj = dispatchMap[dispatchId];
    if (obj) {
        var dispatchObject = obj.dispatchObject;
        if (dispatchObject) {
            if (dispatchObject.callback) {
                dispatchObject.callback(name, json, dispatchObject.object);
            }
            delete dispatchMap[dispatchId];
            dispatchId++;
            if (dispatchId == 0) {
                dispatchId++;
            }
            if (dispatchMap[dispatchId]) {
                obj = dispatchMap[dispatchId];
                dispatchObject = obj.dispatchObject;
                if (dispatchObject.sync) {
                    nativeObj.processCommandSync(dispatchId.toString(), obj.name, obj.json);
                } else {
                    nativeObj.processCommand(dispatchId.toString(), obj.name, obj.json);
                }
            } else {
                
                commandPending = false;
            }
        }
    }
}


String.prototype.escapeSpecialChars = function () {

    return this.replace(/[\\]/g, '\\\\')
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t');
};