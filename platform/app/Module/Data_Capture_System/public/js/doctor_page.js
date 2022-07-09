let ws = null;
window.addEventListener("DOMContentLoaded", async (event) => {
    let data = await (await fetch("/app/api/v1/users")).json();
    if (data.error) {
        return alert("Error: " + data.meesage);
    }
    // data = { "data": [{ "username": "ZoneTwelve", "height": "120", "weight": "120", "age": "943", "bed": "0", "device": "device_A", "state": "1", "gender": "dickhead", "op_code": "0" }, { "username": "ZoneZero", "height": "190", "weight": "60", "age": "24", "bed": "0", "device": "device_A", "state": "1", "gender": "richman", "op_code": "0" }, { "username": "abc", "height": "123", "weight": "123", "age": "123", "bed": "123", "device": "123", "state": "123", "gender": null, "op_code": null }] }

    rtd_initialization(data.data)
    ws = new RTDSocket({ onmessage: RTDSocketMessage });

    navigator.serviceWorker.register('/dcs/sw.js').then(function (registration) {
        // console.log('ServiceWorker registration successful with scope: ', registration.active);
        // let dropdown = document.querySelector("#dropdown-menu");
        // if( dropdown )
        //   createElement( { 
        //     el:"span", className:"dropdown-item", 
        //     innerText:"Update Service worker", 
        //     onclick: () => {
        //       registration.update().then( (res) => {
        //         console.log( res );
        //       } );
        //     }
        //   }).then( ( el ) => dropdown.appendChild( el ) );
        registration.update();
    });
});