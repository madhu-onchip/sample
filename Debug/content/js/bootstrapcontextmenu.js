var somevar = 0;
var popoverdisplayed = false;

(function ($, window) {

    $.fn.popOver = function () {
        
        this.isPopup = false;
        this.clientX = 0;
        this.clientY = 0;
        this.mousecapture = false;
        this.mousetimer = null;
        
        /*
        this.showPopOver = function (token, clientX, clientY, content, html, callback) {
            this.hidePopOver();
            var scope = this;
            if (this.waittimer) {
                clearTimeout(this.waittimer);
                this.waittimer = null;
            }
            this.waittimer = setTimeout(function () {
                scope.showPopOverInternal(token, clientX, clientY, content, html, callback);
            }, 300);
        }
        */

        this.showPopOver = function (clientX, clientY, content, html, callback) {

            
            this.clientX = clientX;
            this.clientY = clientY;
            this.isPopup = true;
            this.contentElement = null;
            this.callback = callback;
            this.mousecapture = true;
            var scope = this;
            
            this.css({
                position: "absolute",
                left: getMenuPosition(this, clientX, 'width', 'scrollLeft'),
                top: getMenuPosition(this, clientY, 'height', 'scrollTop') + 60
            });

            this.contentElement = document.createElement("div");
            $(this.contentElement).addClass("ide-popup-content");

            $(this.contentElement).on("mouseenter", function (me) {
                if (scope.mousetimer) {
                    clearTimeout(scope.mousetimer);
                    scope.mousetimer = null;
                }
                scope.mousecapture = true;
            });
            $(this.contentElement).on("mouseleave", function (me) {
                scope.mousecapture = false;
            });
            
            if (!content) {
                $(this.contentElement).html('<div class="spinner-loader">Loading…</div>');
            } else if (typeof content == 'object') {
                $(this.contentElement).append(content);
            } else if (html) {
                $(this.contentElement).html(content);
            } else {
                $(this.contentElement).text(content);
            }
            this.popover({ html: true, content: $(this.contentElement), trigger: "manual", placement: "auto top" });
            this.popover('show');
            this.mousetimer = setTimeout(function () {
                scope.mousecapture = false;
            }, 1000);
            
        }

        this.hidePopOver = function () {
            if (this.isPopup) {
                this.popover('destroy');
                if (this.contentElement) {
                    $(this.contentElement).remove();
                    this.contentElement = null;
                }
                this.isPopup = false;
            }
            this.mousecapture = false;
            if (this.mousetimer) {
                clearTimeout(this.mousetimer);
                this.mousetimer = null;
            }
            if (this.callback) {
                this.callback();
                this.callback = null;
            }
        }

        

        return this;

        /*
        var popup = this;
        if (!display) {
            try {
                //  $("#debug-expr-pop-over").hide();(
                if (popoverdisplayed) {
                    this.popover('destroy');
                    $("#debug-expr-pop-over").remove();
                    popoverdisplayed = false;
                }
            
            } catch (err) {
                return;
            }
            return;
        }
        if (!content) {
            return;
        }
        $("#debug-expr-pop-over").remove();
        var element  = document.createElement("div");
        $(element).attr("id", "debug-expr-pop-over");
        this.popover({ html: true, content: $(element), trigger: "manual", placement: "auto top" });
        if (!content) {
            $(element).html('<div class="spinner-loader">Loading…</div>');
        } else if (typeof content == 'object') {
            $(element).append(content);
        } else {
            $(element).text(content);
        }
        popoverdisplayed = true;

        this.popover('show');  
*/        
    }

    $.fn.bootstrapContextMenu = function (el, callback) {
        // alert("bootstapContextMenu");

        $(el).on('mouseleave', function (e) {
            $(el).hide();
        });

        $(this).on("contextmenu", function (e) {
            popOver.hidePopOver();
            e.stopPropagation();
            if (callback)  {
                callback(e);
            }
            $(el).trigger("beforeshow", e);
            $(el).show();
            $(el).css({
                position: "absolute",
                left: getMenuPosition(el, e.clientX, 'width', 'scrollLeft'),
                top: getMenuPosition(el, e.clientY, 'height', 'scrollTop')
            });

            return false;

        });

        $(document).click(function () {
            $(el).hide();
        });
    }


    $.fn.contextMenu = function (onMenuOpening) {

        return this.each(function () {

            // Open context menu
            $(this).on("contextmenu", function (e) {
                e.stopPropagation();
                // return native menu if pressing control
             //   if (e.ctrlKey) return;

                onMenuOpening(e, function (menuSelector, menuItems) {

                    //open menu
                    var menu = $(menuSelector);

                    //make sure menu closes on any click
                    $(document).click(function () {
                        menu.hide();
                    });

                    menu.empty();
                    insertMenuItems(menu, menuItems);
                    menu.data("event", e);
                    menu.show();
                    menu.css({
                        position: "absolute",
                        left: getMenuPosition(menu, e.clientX, 'width', 'scrollLeft'),
                        top: getMenuPosition(menu, e.clientY, 'height', 'scrollTop')
                    });
                    
                });

                
                return false;
            });
        });



        function insertMenuItems(parent, menuItems) {
            var divider = true;
            menuItems.map(function (item) {
                if (item["hide"] && (item["hide"] == true)) {
                    return true;
                }
                var ele = document.createElement('li');
                if (item["name"]) {
                    divider = false;
                    if (item["html"])
                    {
                        $(ele).append(item["html"]);
                    }
                    else
                    {
                        $(ele).append('<a href="#">' + escapeHtml(item["name"]) + '</a>');
                    }
                    if (item["handler"]) {
                        $(ele).on("click", item["handler"]);
                    }
                    if (item["disabled"] && (item["disabled"] == true)) {
                        $(ele).addClass('disabled');
                    }
                    if (item["items"]) {
                        insertMenuItems($(ele), item["items"]);
                    }
                } else {
                    if (divider == false) {
                        $(ele).addClass('divider');
                        divider = true;
                    } 
                }

                $(parent).append(ele);
            });
        }

    };

 

    function getMenuPosition(menu, mouse, direction, scrollDir) {
        var win = $(window)[direction](),
            scroll = $(window)[scrollDir](),
            menuWH = menu[direction](),
            position = mouse + scroll;

        // opening menu would pass the side of the page
        if (mouse + menuWH > win && menuWH < mouse)
            position -= menuWH;

        return position;
    }

})(jQuery, window);