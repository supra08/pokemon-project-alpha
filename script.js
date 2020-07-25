let latitude = 23.7, longitude = 86.95, player = '', inventory = [], json = {};

window.onload = async () => {
    initAccount();
    getLocation();
    const ownerDataList = await getStorage();
    setPlayer();
    setInventory(ownerDataList);
    let places = staticLoadPlaces();
    renderPlaces(places);
};

function setInventory(ownerDataList) {
    for (owner of ownerDataList) {
        if (player == owner['player']) {
            inventory = owner['pokemons'];
        }
    }

    var list = document.getElementsByClassName('menu')[0];

    for (let i = 0; i < inventory.length; i++) {
        let li = document.createElement('li');
        let a = document.createElement('a');
        a.appendChild(document.createTextNode(inventory[i]));
        a.setAttribute("onclick", "inventoryHandler()");
        li.appendChild(a);
        list.appendChild(li);
    }
}

async function inventoryHandler(e) {
    e.preventDefault();
    let thisPokemon = e.target.innerHTML;
    await invokeContract('add', { name: player, pokemon: thisPokemon });
    alert(`${thisPokemon} has been removed from the inventory`);
    const ownerDataList = await getStorage();
    setInventory(ownerDataList);
}

function setPlayer() {
    enteredPlayer = prompt("Please enter your username", "Ash");
    if (enteredPlayer == null) {
        setPlayer()
    }
    // validate username
    player = enteredPlayer
}

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
}

function setPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    console.log(latitude);
    console.log(longitude);
}

function staticLoadPlaces() {
    return [
        {
            name: 'Pokèmon',
            location: {
                lat: latitude,
                lng: longitude,
            },
        },
    ];
}

var models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.15 0.15 0.15',
        info: 'Magnemite',
        rotation: '0 180 0',
    },
    {
        url: './assets/articuno/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno',
    },
    {
        url: './assets/dragonite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite',
    },
];

var modelIndex = 0;
var setModel = function (model, entity) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = model.info;
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', async function () {
            await invokeContract('add', { name: player, pokemon: models[modelIndex].info });
            alert('Pokemon is added to your inventory!');
            const ownerDataList = await getStorage();
            setInventory(ownerDataList);
            var entity = document.querySelector('[gps-entity-place]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
    });
}