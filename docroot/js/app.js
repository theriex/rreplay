/*global jtminjsDecorateWithUtilities, document, setTimeout */
/*jslint browser, white, fudge, for, this */

var app = {};
var  jt = {};

(function () {
    "use strict";

    ////////////////////////////////////////
    // local variables
    ////////////////////////////////////////

    var typing = { refidx: 0, charidx: 0 };


    ////////////////////////////////////////
    // local helper functions
    ////////////////////////////////////////

    function displayContactLink (disp) {
        var ref = typing.refs[typing.refidx];
        if(ref.href) {
            disp = ["a", {href: ref.href, onclick: ref.onclick},
                    disp]; }
        jt.out("dcrspan" + typing.refidx, jt.tac2html(disp));
    }


    function typeContactInfo () {
        var ref;
        if(typing.refidx < typing.refs.length) {
            ref = typing.refs[typing.refidx];
            if(ref.text) {
                if(typing.charidx < ref.text.length) {
                    displayContactLink(ref.text.slice(0, typing.charidx));
                    typing.charidx += 1; }
                else {
                    displayContactLink(ref.text);
                    typing.refidx += 1;
                    typing.charidx = 0; } }
            else if(ref.imgsrc) {
                displayContactLink(jt.tac2html(
                    ["img", {src: ref.imgsrc, cla: "refimg"}]));
                typing.refidx += 1;
                typing.charidx = 0; }
            setTimeout(typeContactInfo, 100); }
    }


    function displayContactInfo () {
        var emaddr = "band";
        var site = "rreplay.com";
        var html = [];
        emaddr = emaddr + "@" + site;
        var refs = [{text: "contact:"},
                    {text: " "},  //space breaker
                    {text: emaddr,
                     href: "mailto:" + emaddr}];
        refs.forEach(function (ignore /*ref*/, index) {
            html.push(["span", {id: "dcrspan" + index, cla: "dcrspan"}]); });
        html.push(["span", {id: "dcorgspan"},
                   jt.byId("contactdiv").innerHTML]);
        jt.out("contactdiv", jt.tac2html(html));
        typing.refs = refs;
        setTimeout(typeContactInfo, 100);
    }


    function externalizeLinks () {
        var links = jt.byId("bodyid").getElementsByTagName("a");
        var i;
        var link;
        for(i = 0; i < links.length; i += 1) {
            link = links[i];
            if(link.href && link.href.indexOf("#") < 0) {
                link.href = "#" + link.href;
                jt.on(link, "click", app.openWindowLink); } }
    }


    //Sometimes there's a significant lag loading the fonts, and if
    //that happens the index page should not be waiting to display
    //because that just makes the whole site look slow. To avoid that
    //lag, load the fonts last.  If the fonts load fast, the update
    //will be imperceptible.  If they load slow then at least the
    //content will be available to read in the meantime.
    function addFontSupport () {
        var fontlink = document.createElement("link");
        fontlink.href = "http://fonts.googleapis.com/css?family=Averia+Libre";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
        fontlink = document.createElement("link");
        fontlink.href = "http://fonts.googleapis.com/css?family=Bangers";
        fontlink.rel = "stylesheet";
        fontlink.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(fontlink);
    }


    function adjustNewsHeight () {
        var h = jt.byId("contentdiv").offsetHeight;
        jt.byId("newsdiv").style.height = String(h) + "px";
    }


    ////////////////////////////////////////
    // application level functions
    ////////////////////////////////////////

    app.selectContent = function (divid) {
        var pgs = [{divid:"biodiv", name:"rreplay", cla:"bandname"},
                   {divid:"musicdiv", name:"glitch&nbsp;jam", cla:"normal"}];
                   //{divid:"newsdiv", name:"news", cla:"normal"}];
        var sep = "&nbsp;&nbsp;&nbsp;&nbsp;";
        var html = [];
        pgs.forEach(function (pg, idx) {
            if(pg.divid !== divid) {
                jt.byId(pg.divid).style.display = "none";
                html.push(["a", {href:"#" + pg.name,
                                 onclick:jt.fs("app.selectContent('" + 
                                               pg.divid + "')")},
                           ["span", {cla:pg.cla}, pg.name]]); }
            else {
                jt.byId(pg.divid).style.display = "block";
                html.push(["span", {cla:pg.cla}, pg.name]); }
            if(idx < pgs.length - 1) {
                html.push(sep); } });
        jt.out("navdiv", jt.tac2html(html));
    };


    app.init = function () {
        jtminjsDecorateWithUtilities(jt);
        addFontSupport();
        externalizeLinks();
        var params = jt.parseParams();
        if(params.view === "news") {
            app.selectContent("newsdiv"); }
        else {
            app.selectContent("musicdiv"); }
        displayContactInfo();
        adjustNewsHeight();
    };


    app.openWindowLink = function (event) {
        var href = this.href;
        href = href.slice(href.indexOf("#") + 1);
        window.open(href);
        jt.evtend(event);
    };


} () );

