var app = angular.module('powerProfiler', []);

app.controller('menuCtrlr', function ($scope) {

    $scope.data = {
        capture: false,
        enableSave: false,
        mcu: false,
        wifi: false,
        system: false,
        wyzbee: true,
        timeInSec: false,
        close: true,
    };

    // File menu options
    $scope.open = function () {
        if ($scope.data.capture == false)
            FileOperations.selectFile("Power profiler data file (*.pow)|*.pow|All files (*.*)|*.*", function (data) {
                if (data.status == "OK") {
                    var fpath = new FilePath(data.filePaths[0]);


                    if (fpath.fileExtension.toLowerCase() == "csv") {
                        FileOperations.readFile(data.filePaths[0], function (data) {
                            setCSVText(data.fileText);
                        });
                    }
                    else {
                       $('#slider').slider("option", "value", 0);
                        // $('#slider').slider("option", "max", 0);
                       
                        var dispatchObject = {
                            object: null,
                            sync: true,
                            callback: function (name, json) {

                                var resp;
                                try {
                                    resp = JSON.parse(json);
                                    if (resp.status == "OK") {
                                        $scope.data.close = false;

                                        var avs;
                                        var range;
                                        if ($scope.data.timeInSec == true) {
                                            avs = 1000;
                                            range = 1000000;
                                        } else {
                                            avs = 1;
                                            range = 40000;
                                        }
                                        clearGraph();
                                        $("#totalDur").text(JSON.stringify(resp.totalTimeInSecs/1000) + "sec");

                                        $("#slider").slider({ max: resp.totalTimeInSecs });
                                        graphPos = 0;
                                        graphDepth = 2601;
                                        $('#loader').jqxLoader({ isModal: true, text: "loading...", autoOpen: true });
                                        $('#loader').jqxLoader('open');
                                        displayGraph(graphPos, graphPos + graphDepth, avs, function () {
                                            $('#loader').jqxLoader('close');
                                        });
                                    }
                                }
                                catch (err) {
                                    alert(err);
                                }

                            }

                        }
                        $('#loader').jqxLoader('close');
                        dispatch("OpenBinaryFile", data.filePaths[0], dispatchObject);
                        $("#slider").show();
                       
                        $("#status").text("stopped");
                        $("#zoomRes").text("200%");
                      //  $('#ch1').prop('checked', true);
                      //  $('#ch2').prop('checked', true);
                      //  $('#ch3').prop('checked', true);
                       // $('#ch4').prop('checked', true);
                        $(".pull-right").css("display", "inline");
                        $("#dragg").show();
                        $("#arrow1").css("left", "40px");
                        $("#arrow2").css("left", "50px");
                        $("#markerstable").show();
                        $("#deltaT").text(0 + "sec");
                        $("#Marker1").text(0 + "sec");
                        $("#Marker2").text(0 + "sec");
                        $("#prdSec").text(0 + ' sec');
                        $("#durSec").text(0 + ' sec');
                        
                    }
                }
            });
        else {
            return;
        }
    };

    $scope.close = function () {
        if ($scope.data.close == false) {
            $("#status").text("stopped");
            var dispatchObject = {
                object: null,
                sync: true,
                callback: function (name, resp) {
                    if (resp == "OK") {
                    }
                }
            }
            dispatch("CloseBinaryFile", null, dispatchObject);
            clearGraph();
            $('#chartContainer').jqxChart('refresh');
            $scope.data.close = true;
            PowerProfiler.rangeStart = 0;
            $("#chartContainer").jqxChart('refresh');
            $("#markerstable").hide();
            $(".pull-right").css("display", "none");
            $("#slider").hide();
            $("#dragg").hide();
            $("#deltaT").text(0 + "sec");
            $("#Marker1").text(0 + "sec");
            $("#Marker2").text(0 + "sec");
            $("#prdSec").text(0 + ' sec');
            $("#durSec").text(0 + ' sec');
            $("#totalDur").text(0 + "sec");
        }
        else { return; }
    };

    $scope.save = function () {
        if ($scope.data.enableSave == true) {
            var dispatchObject = {
                object: null,
                sync: true,
                callback: function (name, resp) {
                    if (resp == "OK") {
                        $scope.data.enableSave = false;
                    }
                }

            }
            dispatch("SaveBinaryFile", null, dispatchObject);
        } else { return; }
    };

    $scope.exit = function () {

        nativeObj.closeForm();

    };

    $scope.toggleTime = function (scale) {
        var avs;
        var start = 0;
        var range = 100;

        if (scale == "sec") {
            if ($scope.data.timeInSec == true) {
                return;
            }
            avs = 1000;
            start = 0;
            $scope.data.timeInSec = true;
        } else {
            if ($scope.data.timeInSec == false) {
                return;
            }
            avs = 1;
            start = PowerProfiler.rangeStart;
            $scope.data.timeInSec = false;
        }
        clearGraph();
        displayGraph(start, start + range, avs);

    }

    // Source options
    $scope.toggleSource = function (prop) {
        $scope.data[prop] = !($scope.data[prop]);
        $scope.$apply();
    }

    // Target options
    $scope.start = function () {
        if ($scope.data.capture == false) {
            $scope.data.enableSave = false;

            // $scope.data.timeInSec = true;
            // $("#timeSec").removeClass("active").addClass("active");
            // $("#timeMilli").removeClass("active");
            $scope.$apply();
            //startPolling(100);
            var dispatchObject = {
                object: null,
                callback: function (name, resp) {
                    if (resp == "OK") {
                        $scope.data.capture = true;
                        startPolling(1000);

                    }
                    $scope.$apply();
                }
            }

            dispatch("PowerProfiler", "1", dispatchObject);
            $('#slider').slider("option", "value", 0);
            $("#slider").hide();
            $("#dragg").hide();
            $("#markerstable").hide();
            $("#status").text("Playing");
            $(".pull-right").css("display", "none");
            $("#Marker1").text(0 + "sec");
            $("#Marker2").text(0 + "sec");
            $("#durSec").text("0 sec");
            $("#prdSec").text("0 sec");
            $("#deltaT").text(" 0 sec");
            $("#totalDur").text(0 + "sec");
            

        }
        else { return; }
    };

    $scope.stop = function () {
        if ($scope.data.capture == true) {
            $scope.data.capture = false;
            $("#arrow1").css("left", "40px");
            $("#arrow2").css("left", "50px");
            $("#status").text("stopped");
            var dispatchObject = {
                object: null,
                callback: function (name, json) {
                    var resp = JSON.parse(json);
                    $("#totalDur").text(JSON.stringify(resp.totalTimeInSecs/1000) + "sec");
                    $("#slider").slider({ max: resp.totalTimeInSecs });

                    $scope.data.capture = false;
                    if (resp.status == "OK") {
                        $scope.data.enableSave = true;

                    }
                    $scope.$apply();
                    stopPolling();
                }

            }
            dispatch("PowerProfiler", "0", dispatchObject);

            stopPolling();
            $('#slider').slider("option", "value", 0);
           // $('#slider').slider("option", "max", 0);
            $("#slider").show();
            $(".pull-right").css("display", "inline");
            $("#zoomRes").text("100%");
           // $('#ch1').prop('checked', true);
           // $('#ch2').prop('checked', true);
           // $('#ch3').prop('checked', true);
           // $('#ch4').prop('checked', true);

            $("#dragg").show();
            $("#markerstable").show();


        }
        else { return; }
    };



});
