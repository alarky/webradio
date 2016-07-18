
window.addEventListener("DOMContentLoaded", function() {
    var Station = function(data) {
        var self = this;
        
        self.id = m.prop(data.pk);
        self.genre     = m.prop(data.fields.genre);
        self.name      = m.prop(data.fields.name);
        self.site_url  = m.prop(data.fields.site_url);
        self.audio_url = m.prop(data.fields.audio_url);
    };
    
    var ViewModel = function() {
        var self = this;
        
        self.stations = m.prop(STATIONS.map(function(station) {
            return new Station(station);
        }));
        self.station = m.prop(self.stations()[0]);

        self.is_playing = m.prop(false);
        self.audio = new Audio();
        self.volume = m.prop(75);
        
        self.pause = function() {
            self.is_playing(false);
            self.audio.pause();
        };
        
        self.play = function() {
            self.is_playing(true);
            self.audio.src = self.station().audio_url();
            self.audio.play();
        };
        
        self.toggle = function() {
            if (self.is_playing()) {
                self.pause();
            } else {
                self.play();
            }
        };
        
        self.changeVolume = function(e) {
            self.volume(e.target.value);
            self.audio.volume = self.volume()/100;
        };
        
        self.changeStation = function(station) {
            self.pause();
            self.station(station);
            self.play();
        };
        
    };
    
    var component = {
        controller: function() {
            this.vm = new ViewModel();
        },
        view: function(ctrl) {
            return [
                m("div", {class:"mdl-grid"}, [
                    m("div", {class:"mdl-cell mdl-cell--12-col player"}, [
                        m("table", [
                            m("tr", [
                                m("td", {class:"play-cell"}, [
                                    m("button", {class:"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect", onclick:ctrl.vm.toggle}, [
                                        m("i", {class:"material-icons"}, ctrl.vm.is_playing() ? "pause" : "play_arrow")
                                    ])
                                ]),
                                m("td", {class:"volume-cell"}, [
                                    m("input", {class:"mdl-slider mdl-js-slider", type:"range", min:"0", max:"100", value:ctrl.vm.volume(), oninput:ctrl.vm.changeVolume})
                                ]),
                                m("td")
                            ]),
                            m("tr", [
                                m("td", "station:"),
                                m("td", {colspan:2}, [
                                    m("a", {class:"station-link", href:ctrl.vm.station().site_url()}, ctrl.vm.station().name())
                                ])
                            ])
                        ])
                    ])
                ]),
                m("div", {class:"mdl-grid"}, ctrl.vm.stations().map(function(station) {
                    return m("div", {class:"mdl-cell mdl-cell--4-col station", onclick:function(){ ctrl.vm.changeStation(station) }}, station.name())
                }))
            ];
        }
    };
    
    m.mount(document.getElementById("mithril-component"), component);
});