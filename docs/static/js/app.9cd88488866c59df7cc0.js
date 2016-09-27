webpackJsonp([2,0],{0:function(e,t,o){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}var a=o(55),r=s(a),n=o(52),i=s(n);new r["default"]({el:"body",components:{App:i["default"]}})},13:function(e,t,o){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=o(53),r=s(a);t["default"]={components:{wardrobe:r["default"]}}},14:function(e,t,o){"use strict";function s(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var a=o(17),r=s(a),n=o(16),i=s(n),d=o(15),c=s(d),l=o(54);t["default"]={name:"wardrobe",components:{"button-group":l.buttonGroup,radio:l.radio},data:function(){return{imgWidth:150,msg:"Гардероб!",wardrobe:"empty",weather:"any",accessories:"empty",look:{main:"empty",accessories:"empty"},storedLooks:[]}},ready:function(){var e=window.localStorage.getItem("storedLooks");e&&(e=JSON.parse(e),this.storedLooks=e)},methods:{saveLook:function(){var e=this,t=function(t,o){for(var s=!0,a=0;a<e.storedLooks.length;++a)if((0,c["default"])(o[a].look)===(0,c["default"])(t)){s=!1;break}return s},o=function a(){for(var a=1,t=0;t<e.storedLooks.length;++t){var o=parseInt(e.storedLooks[t].name,10);o>=a&&(a=o+1)}return a};if("empty"!==this.look.main&&t(this.look,this.storedLooks)){var s={};s.name=o(),s.look=(0,i["default"])({},this.look),this.storedLooks.push(s),s=(0,c["default"])(this.storedLooks),window.localStorage.setItem("storedLooks",s)}},deleteLook:function(e){this.storedLooks.splice(e,1),window.localStorage.setItem("storedLooks",(0,c["default"])(this.storedLooks))},loadLook:function(e){this.look=JSON.parse((0,c["default"])(this.storedLooks[e].look))},loadWardrobe:function(){var e=this,t=new XMLHttpRequest;t.open("GET","static/wardrobe.json",!0),t.send(),t.onreadystatechange=function(){if(4===t.readyState)if(200!==t.status)console.debug(t.status+": "+t.statusText);else{var o=JSON.parse(t.responseText);e.accessories=o.accessories,delete o.accessories,e.wardrobe=o}}},generateLook:function(){var e=this,t=function(t){var o={};return(0,r["default"])(t).forEach(function(s){"__ob__"!==s&&(o[s]=[],t[s].forEach(function(t){t.weather.indexOf(e.weather)>-1?o[s].push(t.path):"any"===e.weather&&o[s].push(t.path)}),o[s].length<1&&delete o[s])}),o},o={},s=t(this.wardrobe),a=t(this.accessories),n=function(e,t){var o=[e,t];return o[Math.round(Math.random())]},i=n("bottom","dress");(0,r["default"])(s).forEach(function(e){if("__ob__"!==e&&e!==i){var t=Math.round(Math.random()*(s[e].length-1));o[e]=s[e][t]}});var d={};(0,r["default"])(a).forEach(function(e){var t=Math.random()-.5;if(t>0&&"__ob__"!==e){var o=Math.round(Math.random()*(a[e].length-1));d[e]=a[e][o]}}),this.look.main=o,this.look.accessories=d},calcItems:function(e){var t=0;return e instanceof Object&&(0,r["default"])(e).forEach(function(o){t+=e[o].length||0}),t},getClass:function(e){return e}},created:function(){}}},48:function(e,t){},49:function(e,t){},50:function(e,t){e.exports=" <div id=app> <wardrobe></wardrobe> </div> "},51:function(e,t){e.exports=' <div class=hello _v-02c85d1e=""> <h1 _v-02c85d1e="">{{ msg }}</h1> <template v-if="wardrobe.hasOwnProperty(\'top\')"> <p _v-02c85d1e="">Всего вещей: {{calcItems(wardrobe)}}, аксессуаров: {{calcItems(accessories)}}</p> </template> <button class="btn btn-primary" v-on:click=loadWardrobe() v-if="wardrobe === \'empty\'" _v-02c85d1e="">Загрузить гардероб </button> <template v-if="wardrobe.hasOwnProperty(\'top\')"> <button-group :value.sync=weather type=default _v-02c85d1e=""> <radio value=winter _v-02c85d1e="">Зима</radio> <radio value=inter_season _v-02c85d1e="">Межсезонье</radio> <radio value=summer _v-02c85d1e="">Лето</radio> </button-group> <button class="btn btn-link" v-on:click="weather = \'any\'" _v-02c85d1e="">&lt; Без разницы</button> <button class="btn btn-primary" v-on:click=generateLook() _v-02c85d1e="">Создать образ</button> <button class="btn btn-default" v-on:click=saveLook() v-if="look.main !== \'empty\'" _v-02c85d1e="">Сохранить</button> </template> <div class=look _v-02c85d1e=""> <div class=look__main v-if="look.main !== \'empty\'" _v-02c85d1e=""> <div class=wardrobe-item v-for="(key, item) in look.main" v-bind:class=getClass(key) _v-02c85d1e=""> <img :src="\'static/images/\' + key + \'/\' + item" :width=imgWidth _v-02c85d1e=""> </div> </div> <div class=look__accessories v-if="look.accessories !== \'empty\'" _v-02c85d1e=""> <div class=wardrobe-item v-for="(key, item) in look.accessories" _v-02c85d1e=""> <img :src="\'static/images/accessories/\' + key + \'/\' + item" :width=imgWidth _v-02c85d1e=""> </div> </div> </div> <div _v-02c85d1e=""> <h3 _v-02c85d1e="">Сохраненные образы</h3> <div class="btn-toolbar saved-looks" style=text-align:center _v-02c85d1e=""> <div class=btn-group role=group v-for="look in storedLooks" _v-02c85d1e=""> <button type=button class="btn btn-default btn-sm" v-on:click=loadLook($index) _v-02c85d1e="">{{look.name}}</button> <button type=button class="btn btn-warning btn-sm" v-on:click=deleteLook($index) _v-02c85d1e="">✕</button> </div> </div> </div> </div> '},52:function(e,t,o){var s,a;o(48),s=o(13),a=o(50),e.exports=s||{},e.exports.__esModule&&(e.exports=e.exports["default"]),a&&(("function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports).template=a)},53:function(e,t,o){var s,a;o(49),s=o(14),a=o(51),e.exports=s||{},e.exports.__esModule&&(e.exports=e.exports["default"]),a&&(("function"==typeof e.exports?e.exports.options||(e.exports.options={}):e.exports).template=a)}});
//# sourceMappingURL=app.9cd88488866c59df7cc0.js.map