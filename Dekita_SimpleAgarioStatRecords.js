// ==UserScript==
// @name        Agar.io ~ Simple Stat Records By Dekita
// @namespace   http://www.dekyde.com
// @description Agar.io modifications
// @version     0.9
// @author      Dekita
// @match       *://agar.io/*
// @grant       none
// ==/UserScript==
(function (AgarioStatRecordsByDekita) {
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
         * 
         * 
         */ 
        opac: '0.6',

        /**
         * 
         * 
         */ 
        posi: { 
            x: '10px', 
            y: '10px', 
        },

        /**
         * 
         * 
         */ 
        size: { 
            w: 'auto', 
            h: 'auto', 
        },

        /**
         * 
         * 
         */ 
        colr: {
            back: 'black',
            text: 'white',
        },

        /**
         * 
         * 
         */ 
        text: {
            mass: '-Mass: ',
            food: '-Food: ',
            time: '-Time: ',
            cell: '-Kills: ',
            lead: '-Leaderboard: ',
            ltim: '-Leader Time: ',
        }, 
        /**
         * End of SETTINGS
         */ 
    };

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ Adds the main html element into the page                             |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////

    var div = document.createElement("div");
    div.className = 'thumbnail';
    div.style.zIndex = '100';
    div.style.position = 'fixed';
    div.style.opacity = SETTINGS.opac;
    div.style.background = SETTINGS.colr.back;
    div.style.color = SETTINGS.colr.text;
    div.style.left = SETTINGS.posi.x;
    div.style.top = SETTINGS.posi.y;
    div.style.width = SETTINGS.size.w;
    div.style.height = SETTINGS.size.h;
//    div.style.padding = '0 !important';
//    div.style.margin = '0 !important';
    div.innerHTML = '\
        <div class="table-responsive">\
            <table class="table table-condensed">\
            <thead>\
                <tr>\
                    <th>Type: </th>\
                    <th>Avrg: </th>\
                    <th>Best: </th>\
                    <th>Last: </th>\
                </tr>\
            </thead>\
            <tbody>\
                <tr>\
                    <td>Mass</td>\
                    <td id="dekimassavrg"></td>\
                    <td id="dekimassbest"></td>\
                    <td id="dekimasslast"></td>\
                </tr>\
                <tr>\
                    <td>Food</td>\
                    <td id="dekifoodavrg"></td>\
                    <td id="dekifoodbest"></td>\
                    <td id="dekifoodlast"></td>\
                </tr>\
                <tr>\
                    <td>Time</td>\
                    <td id="dekitimeavrg"></td>\
                    <td id="dekitimebest"></td>\
                    <td id="dekitimelast"></td>\
                </tr>\
                <tr>\
                    <td>Cell</td>\
                    <td id="dekicellavrg"></td>\
                    <td id="dekicellbest"></td>\
                    <td id="dekicelllast"></td>\
                </tr>\
                <tr>\
                    <td>Lead</td>\
                    <td id="dekileadavrg"></td>\
                    <td id="dekileadbest"></td>\
                    <td id="dekileadlast"></td>\
                </tr>\
                <tr>\
                    <td>Ltim</td>\
                    <td id="dekiltimavrg"></td>\
                    <td id="dekiltimbest"></td>\
                    <td id="dekiltimlast"></td>\
                </tr>\
            </tbody>\
            </table>\
        </div>\
    ';
    $('body').append(div);

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ Class to store the global information                                |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////
    function AnAverageClass(){};
    AnAverageClass.MassLast = 0;
    AnAverageClass.FoodLast = 0;
    AnAverageClass.CellLast = 0;
    AnAverageClass.LeadLast = 0;
    AnAverageClass.MassBest = 0;
    AnAverageClass.FoodBest = 0;
    AnAverageClass.CellBest = 0;
    AnAverageClass.LeadBest = 0;
    AnAverageClass.TimeLast ='';
    AnAverageClass.LtimLast ='';
    AnAverageClass.TimeBest ='';
    AnAverageClass.LtimBest ='';
    AnAverageClass.MassAvge = [];
    AnAverageClass.FoodAvge = [];
    AnAverageClass.TimeAvge = [];
    AnAverageClass.CellAvge = [];
    AnAverageClass.LeadAvge = [];
    AnAverageClass.LtimAvge = [];
    AnAverageClass.UpdateData = function() {
        this.MassLast = Number($(".stats-highest-mass").text());
        this.FoodLast = Number($(".stats-food-eaten").text());
        this.CellLast = Number($(".stats-cells-eaten").text());
        this.LtimLast = $(".stats-leaderboard-time").text();
        this.LeadLast = $(".stats-top-position").text();
        this.TimeLast = $(".stats-time-alive").text();
        this.MassBest = this.GetBestData(this.MassLast, this.MassBest);
        this.FoodBest = this.GetBestData(this.FoodLast, this.FoodBest);
        this.TimeBest = this.GetBestData(this.TimeLast, this.TimeBest);
        this.CellBest = this.GetBestData(this.CellLast, this.CellBest);
        this.LeadBest = this.GetBestData(this.LeadLast, this.LeadBest);
        this.LtimBest = this.GetBestData(this.LtimLast, this.LtimBest);
        this.MassAvge.push(this.MassLast);
        this.FoodAvge.push(this.FoodLast);
        this.TimeAvge.push(this.TimeLast);
        this.CellAvge.push(this.CellLast);
        this.LeadAvge.push(this.LeadLast);
        this.LtimAvge.push(this.LtimLast);
    };
    AnAverageClass.GetBestData = function(lastValue, bestValue) {
        return (lastValue > bestValue) ? lastValue : bestValue;
    };
    AnAverageClass.GetAverageData = function(dataContainer) {
        var size = dataContainer.length-1;
        if (size > 0) {
            var value = AnAverageClass.GetTotalDataValue(dataContainer) / size;
            return value.toFixed(1);
        };  return '0';
    };
    AnAverageClass.GetTotalDataValue = function(dataContainer) {
        var totalValue = 0;
        // Note: not 'i >= 0' as we want to skip the first one.
        for (var i = dataContainer.length - 1; i > 0; i--) {
            if (dataContainer[i] !== ':('){
                totalValue += dataContainer[i];
            } else {
                totalValue += 0;
            };
        };
        return totalValue;
    };
    AnAverageClass.TimeToObjekt = function(str_array) {
        var d = str_array.split(':');
        return {
            h: parseInt(d.length > 2 ? d.shift() : '0', 10),
            m: parseInt(d.length > 1 ? d.shift() : '0', 10),
            s: parseInt(d.length > 0 ? d.shift() : '0', 10),
        };
    };
    AnAverageClass.GetAverageTime = function(timeArray) {
        var h = 0, m = 0, s = 0;
        var z = timeArray.length;
        for (var i = z - 1; i >= 0 && timeArray[i]; i--) {
            var d = this.TimeToObjekt(timeArray[i]);
            if (d.h || d.m || d.s){
                h += d.h; m += d.m; s += d.s;
            } else { z--; };
        };  h /= z; m /= z; s /= z;
        s += (m - Math.floor(m)) * 60;
        m += (h - Math.floor(h)) * 60;
        h  = Math.round(Math.floor(h));
        m += Math.floor(s / 60); s %= 60;
        h += Math.floor(m / 60); m %= 60;
        return { 
            h: this.PadTimeNums( Math.floor(h) ), 
            m: this.PadTimeNums( Math.floor(m) ), 
            s: this.PadTimeNums( Math.floor(s) ),
        };
    };
    AnAverageClass.GetAverageTimeData = function(timeArray) {
        var data = this.GetAverageTime(timeArray);
        return data.h+':'+data.m+':'+data.s;
    };
    AnAverageClass.PadTimeNums = function(timeNumber) {
        timeNumber = String(timeNumber);
        while (timeNumber.length < 2){
            timeNumber = '0' + timeNumber;
        };
        return timeNumber;
    };
    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ Functions to set the new data when its reset                         |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////

    AnAverageClass.SetNewHighMass = function() {
        $("#dekimasslast").text(this.MassLast);
        $("#dekimassbest").text(this.MassBest);
        $("#dekimassavrg").text(this.GetAverageData(this.MassAvge));
    };
    AnAverageClass.SetNewHighFood = function() {
        $("#dekifoodlast").text(this.FoodLast);
        $("#dekifoodbest").text(this.FoodBest);
        $("#dekifoodavrg").text(this.GetAverageData(this.FoodAvge));
    };
    AnAverageClass.SetNewHighTime = function() {
        $("#dekitimelast").text(this.TimeLast);
        $("#dekitimebest").text(this.TimeBest);
        $("#dekitimeavrg").text(this.GetAverageTimeData(this.TimeAvge));
    };
    AnAverageClass.SetNewHighCell = function() {
        $("#dekicelllast").text(this.CellLast);
        $("#dekicellbest").text(this.CellBest);
        $("#dekicellavrg").text(this.GetAverageData(this.CellAvge));
    };
    AnAverageClass.SetNewHighLead = function() {
        $("#dekileadlast").text(this.LeadLast);
        $("#dekileadbest").text(this.LeadBest);
        $("#dekileadavrg").text(this.GetAverageData(this.LeadAvge));
    };
    AnAverageClass.SetNewHighLtim = function() {
        $("#dekiltimlast").text(this.LtimLast);
        $("#dekiltimbest").text(this.LtimBest);
        $("#dekiltimavrg").text(this.GetAverageTimeData(this.LtimAvge));
    };

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ Methods to determine when data needs altered                         |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////

    AnAverageClass.lastNeedReset =-1;
    AnAverageClass.NeedReset = function() {
        return Boolean(this.lastNeedReset != this.GetResetData());
    };
    AnAverageClass.ResetNeedReset = function() {
        this.lastNeedReset = this.GetResetData();
    };
    AnAverageClass.GetResetData = function() {
        return Number($(".stats-highest-mass").text());
    };

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ The main loop                                                        |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////

    function DeLoop(argument) {
        if (AnAverageClass.NeedReset.apply(AnAverageClass)){
            AnAverageClass.UpdateData.apply(AnAverageClass);
            AnAverageClass.SetNewHighMass.apply(AnAverageClass);
            AnAverageClass.SetNewHighFood.apply(AnAverageClass);
            AnAverageClass.SetNewHighTime.apply(AnAverageClass);
            AnAverageClass.SetNewHighCell.apply(AnAverageClass);
            AnAverageClass.SetNewHighLead.apply(AnAverageClass);
            AnAverageClass.SetNewHighLtim.apply(AnAverageClass);
            AnAverageClass.ResetNeedReset.apply(AnAverageClass);
        };
        setTimeout(DeLoop, 1000);
    }
    DeLoop();

    /*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
     *                                                                        |
     * ■ End of script                                                        |
     *                                                                        |
     */////////////////////////////////////////////////////////////////////////
})();
