var translations_EN={TITLE:"Random Name Selector",ADD:"Add a new label",EMPTY_TEXT:"Enter something",NAME:"Name",SELECTED:"Selected #",SPIN:"randomize",WINNER:"selected",CLIENTS:"Currently we have {{ clients }} clients."},translations_DE={TITLE:"Zufallsnamen Wählscheibe",ADD:"Name hinzufügen",EMPTY_TEXT:"Text eingeben",NAME:"Name",SELECTED:"Ausgewählt #",SPIN:"Drehen",WINNER:"Ausgewählt",CLIENTS:"Es schauen gerade: {{ clients }} zu."},myApp=angular.module("spinner",["spinner.controllers","spinner.directives","ngAnimate","pascalprecht.translate"]).config(["$translateProvider",function(n){n.translations("en",translations_EN).translations("de",translations_DE).registerAvailableLanguageKeys(["en","de"],{"en-*":"en","de-*":"de"}).useSanitizeValueStrategy("escape").uniformLanguageTag("bcp47").determinePreferredLanguage().fallbackLanguage("en")}]);angular.module("spinner.controllers",["spinner.services","toaster"]).controller("EntriesCtrl",["$scope","myService","toaster","$timeout","$log","$window","$translate",function(n,e,t,i,a,r,o){"use strict";function c(){a.log("STOMP: Attempting connection"),s=new SockJS("/spinner"),p=Stomp.over(s),p.connect({},m,v)}var s,p;n.participants=[],n.winner="",n.newName="",n.connected=0,n.spinning=!1,n.add=function(i){var r={name:n.newName.trim()};t.clear("*"),e.create(r).then(function(e){n.newName=""},function(n){t.pop("error","Backend error",n.message),a.log(n)})};var u=function(e){n.participants.push(e),l()},l=function(e){n.spinning||(b.update(h()),n.$apply())},d=function(e){var t;for(t=0;t<n.participants.length&&n.participants[t].id!==e;t++);n.participants.splice(t,1),l()},f=function(e){n.connected=e,l()},g=function(e){n.spinning=!0;var a;for(a=0;a<n.participants.length&&n.participants[a].id!==e.id;a++);b.update(h());var r=n.participants.length-a-1,c=r*(360/n.participants.length)+360+360/n.participants.length/2,s=c+7200,p=b.spin(s);i(function(){n.winner=e,n.participants[a]=e,n.spinning=!1,n.$apply(),o(["WINNER"]).then(function(n){t.pop("success",n.WINNER,e.name)})},p.duration)},m=function(e){a.log("Connected "+e),p.subscribe("/app/participants",function(e){var t=angular.fromJson(e.body);n.participants=t.entries,n.connected=t.connected,l()}),p.subscribe("/topic/added",function(n){u(angular.fromJson(n.body))}),p.subscribe("/topic/deleted",function(n){d(angular.fromJson(n.body))}),p.subscribe("/topic/spin",function(n){g(angular.fromJson(n.body))}),p.subscribe("/topic/count",function(n){f(angular.fromJson(n.body))})},v=function(n){f(0),a.log("STOMP: "+n),i(c,1e4),a.log("STOMP: Reconnecting in 10 seconds")};c(),n.remove=function(n){p.send("/app/remove",{},JSON.stringify(n.id))};var h=function(){var e=[];return angular.forEach(n.participants,function(n){this.push(n.name.substring(0,8))},e),e},E=Math.min(r.innerWidth/2,220)-20,b=new Spinner("#spinnerContainer",{margins:{top:40,right:10,bottom:10,left:10},outerR:E,h:450,w:2*E+20,data:h()});n.spin=function(){t.clear("*"),e.spin().then(function(e){n.winner=""},function(n){t.pop("error","Backend error",n.message),a.log(n)})},n.info=function(){o("CLIENTS",{clients:n.connected}).then(function(n){t.pop("info","Clients",n)})}}]);var myApp=angular.module("spinner.services",[]).factory("myService",["$http",function(n){"use strict";var e={create:function(e){return n.post("participants/",e).then(function(n){return n.data},function(n,e,t,i){var a;throw n.data&&(a=n.data.message),new Error(a||"Can't talk to server - server down?")})},spin:function(){return n.get("participants/random").then(function(n){return n.data},function(n,e,t,i){var a;throw n.data&&(a=n.data.message),new Error(a||"Can't talk to server - server down?")})}};return e}]);angular.module("spinner.directives",[]).directive("zodiac",function(){return{template:'<canvas id="zodiac"></canvas>',restrict:"E",link:function(n,e){"use strict";new Zodiac(e.children()[0],{directionX:0,directionY:-1,velocityX:[.1,.3],velocityY:[.3,.7],bounceX:!0,bounceY:!1,parallax:.2,pivot:0,density:9999,dotRadius:[1,5],linkColor:"#FFDAB9",linkDistance:55,linkWidth:2})}}});