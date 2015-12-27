// ==UserScript==
// @name        Agar.io ~ Simple Mods By Dekita
// @namespace   http://www.dekyde.com
// @description Agar.io modifications
// @version     0.9
// @author      Dekita
// @match       *://agar.io/*
// @grant       none
// ==/UserScript==
(function (AgarioModificationsByDekita) {
    /**
     * Enable strict mode to enforce stronger syntax rules
     */
    "use strict";

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ SETTINGS                                                             |
     * This section defines the various user settings for this script         |
     * there is a small description for each available parameter.             |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////
    var SETTINGS = {

        /**
         * presetName: {string}
         * Defines the default username used for the game.
         * This saves you having to manually type your favorite 
         * username each time you load the game. 
         */ 
        presetName: "■ ᴆᴀřᴋ ᴆᴈᴋᴉᴦᴀ ■",

        /**
         * showColors: {boolean}
         * Defines whether cells and agar will have color.
         * skins will still show in color regardless. 
         */ 
        showColors: true,

        /**
         * showCellSkin: {boolean}
         * Defines whether a cells skins will show.
         */ 
        showCellSkin: true,

        /**
         * showUserNames: {boolean}
         * Defines whether player cell names will be shown.
         */ 
        showUserNames: true, 

        /**
         * showPlayerMass: {boolean}
         * Defines whether your cells mass is shown.
         */ 
        showPlayerMass: true, 

        /**
         * useDarkTheme: {boolean}
         * Defines whether dark mode is used or not.
         */ 
        useDarkTheme: true, 

        /**
         * setSkipStats: {boolean}
         * Defines whether to skip the stats screen upon game end.
         */ 
        setSkipStats: false, 

        /**
         * playAcidMode: {boolean}
         * Defines whether game is set to acid mode or not.
         * Acid mode is a hidden game mechanic that has not been
         * implemented by the developer for whatever reasons.
         * it will make all orbs leave a trail behind them.
         * DO NOT USE THIS IF: you are sensitive to light effects.
         */ 
        playAcidMode: false, 

        /**
         * remove_ads: {boolean}
         * Removes the annoying adverts shown on the game menu. 
         */ 
        remove_ads: true,

        /**
         * linkDekita: {boolean}
         * Links back to my own website.
         * This also slightly modifies the main menu header text.
         */ 
        linkDekita: true,

        /**
         * mouseSplit: {object}  Defines whether you can use the mouse to split.
         * @param use: {boolean} Determines whether mouse split is allowed.
         * @param key: {number}  The mouse button to use (1=Left, 3=Right)
         */ 
        mouseSplit: { use: true, key: 1 },

        /**
         * mouseEject: {object}  Defines whether you can use the mouse to eject mass.
         * @param use: {boolean} Determines whether mouse eject is allowed.
         * @param key: {number}  The mouse button to use (1=Left, 3=Right)
         */ 
        mouseEject: { use: true, key: 3 },

        /**
         * multiEject: {object}  Allows you to eject mass multiple times.
         * @param use: {boolean} Determines whether multi eject is allowed.
         * @param num: {number}  Defines the number of times you will eject mass.
         * @note The shift key must be held down when ejecting mass for this to trigger.
         * @note This only works when the mouse eject is active. 
         */ 
        multiEject: { use: true, num: 7 },

        /**
         * multiSplit: {object}  Allows you to instantly split multiple times.
         * @param use: {boolean} Determines whether multi split is allowed.
         * @param num: {number}  Defines the number of times you will split.
         * @note The shift key must be held down when splitting for this to trigger.
         * @note This only works when the mouse split is active. 
         */ 
        multiSplit: { use: true, num: 4 },

        /**
         * End of SETTINGS
         */ 
    };

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ End of SETTINGS                                                      |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////

    /**
     * Remove Advertisements:
     */
    if (SETTINGS.remove_ads){
        $("#adbg").hide();
        $(".agario-promo").hide();
        $("div#s300x250").hide();
        $("div.form-group div[style='float: right; margin-top: 10px; height: 40px;']").hide();
    };

    /**
     * Link Dekita's 'Dekyde' website:
     */
    if (SETTINGS.linkDekita){
        var ahref = '<a href="http://www.dekyde.com"><h3>Agar.io';
        var small = '<small> - modded by Dekita</small></h3></a>';
        $("div.form-group div h2").html(ahref + small);
    };

    /**
     * Setup mouse split (mitosis) keycodes:
     */
    if (SETTINGS.mouseSplit.use){
        var data = {keyCode: 32};
        SETTINGS.mouseSplit.dek = {
            u: $.Event("keyup",  data),
            d: $.Event("keydown",data),
        };
    };

    /**
     * This function is called when the mouse split button is pressed
     */
    function AgarMouseSplit(timesToLoop) {
        for (var i = timesToLoop; i > 0 && SETTINGS.mouseSplit.use; i--) {
            $("body").trigger(SETTINGS.mouseSplit.dek.d);
            $("body").trigger(SETTINGS.mouseSplit.dek.u);
        };
    };

    /**
     * Setup mouse eject (feed) keycodes:
     */
    if (SETTINGS.mouseEject.use){
        var data = {keyCode: 87};
        SETTINGS.mouseEject.dek = {
            u: $.Event("keyup",  data),
            d: $.Event("keydown",data),
        };
    };

    /**
     * This function is called when the mouse eject button is pressed
     */
    function AgarMouseEject(timesToLoop) {
        console.log("Ejecting Mass");
        if (timesToLoop > 0 && SETTINGS.mouseEject.use){
            $("body").trigger(SETTINGS.mouseEject.dek.d);
            $("body").trigger(SETTINGS.mouseEject.dek.u);
            setTimeout(function(){AgarMouseEject(--timesToLoop)},100);
        };
    };

    /**
     * This function is called to handle all mouse events
     */
    function AgarMouse(mouseEvent) {
        var timesToLoop = 1; 
        switch(mouseEvent.which) {
            case SETTINGS.mouseSplit.key: 
                if (mouseEvent.shiftKey && SETTINGS.multiSplit.use){
                    timesToLoop = SETTINGS.multiSplit.num;
                };  AgarMouseSplit(timesToLoop);
                break;
            case SETTINGS.mouseEject.key: 
                if (mouseEvent.shiftKey && SETTINGS.multiEject.use){
                    timesToLoop = SETTINGS.multiEject.num;
                };  AgarMouseEject(timesToLoop);
                break;
        }; 
    }; 

    /**
     * This function disables the default context menu showing
     * when a right click has been pressed.
     */
    function StopMouseClicks(mouseEvent) {
        if (mouseEvent.button == 2 || mouseEvent.button == 3){
          mouseEvent.preventDefault();
          mouseEvent.stopPropagation();
          return false;
        };
        return true;
    };

    /**
     * Enables the mouse functions only if settings allow it.
     */
    if (SETTINGS.mouseSplit.use || SETTINGS.mouseEject.use){
        $(document).bind('mousedown', AgarMouse);
        document.ondblclick = StopMouseClicks;
        document.onclick = StopMouseClicks;
    }; 

    /**
     * function to easily define checkbox data
     */
    function getOptionsCheckbox(funkName,dataItrName,index) {
        return "<label><input id='options" + index + "'disabled='disabled' type='checkbox' onchange='" + funkName + "(!$(this).is(':checked'));'><span data-itr='" + dataItrName + "'></span></label>";
    };

    /**
     * Setup the defaul option checkboxes
     */
    $("#options").html(
        getOptionsCheckbox('setSkins','option_no_skins',1) + 
        getOptionsCheckbox('setNames','option_no_names',2) + 
        getOptionsCheckbox('setColors','option_no_colors',3) + 
        getOptionsCheckbox('setShowMass','option_show_mass',4) + 
        getOptionsCheckbox('setDarkTheme','option_dark_theme',5) + 
        getOptionsCheckbox('setSkipStats','option_skip_stats',6) + 
        getOptionsCheckbox('setAcid','Acid Mode',7) 
    );

    /**
     * Set the default settings checkboxes in the menu
     * this simply helps to show which settings are 
     * currently enabled from this script. 
     */ 
    $("#options1").attr('checked', SETTINGS.showCellSkin); 
    $("#options2").attr('checked', SETTINGS.showUserNames); 
    $("#options3").attr('checked', !SETTINGS.showColors); 
    $("#options4").attr('checked', SETTINGS.showPlayerMass); 
    $("#options5").attr('checked', SETTINGS.useDarkTheme); 
    $("#options6").attr('checked', SETTINGS.setSkipStats); 
    $("#options7").attr('checked', SETTINGS.playAcidMode); 

    /**
     * This is where the default settings are actually
     * applied onto the game. The above code only adds
     * visual aids to show the default settings. 
     */
    $("#nick").val(SETTINGS.presetName); 
    setColors(!SETTINGS.showColors);
    setSkins(SETTINGS.showCellSkin);
    setNames(SETTINGS.showUserNames);
    setShowMass(SETTINGS.showPlayerMass);
    setDarkTheme(SETTINGS.useDarkTheme);
    setSkipStats(SETTINGS.setSkipStats);
    setAcid(SETTINGS.playAcidMode);

    //console.log("Mass Text: " + $(".stats-highest-mass").text());
    //$('body').append('<div style="position:absolute;opacity:0.7;z-index:100;background:#000;"><h4 id="dekibit">Showing Text </h4></div>');
    //$("#dekibit").val("My Awesome Text"); 


    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ End of script                                                        |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////
})();
