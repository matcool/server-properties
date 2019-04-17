function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

for (let btn of document.querySelectorAll('btnToggle')) {
    btn.innerHTML = `<button type="button" class="btn btn-secondary">Off</button>`;
    btn.pressed = false;
    btn.onclick = () => {
        let childBtn = btn.children[0];
        btn.pressed = !btn.pressed;
        childBtn.classList.toggle('btn-success');
        childBtn.classList.toggle('btn-secondary');
        childBtn.innerHTML = btn.pressed ? 'On' : 'Off';
    };
    if (btn.attributes.on !== undefined) btn.onclick();
}

for (let btn of document.getElementsByClassName('property-button')) {
    let orig = btn.onclick;
    if (!isFunction(orig)) orig = () => {};
    btn.onclick = () => {
        orig();
        updateProperties();
    };
}
let properties = {};

function updateProperties() {
    for (let btn of document.getElementsByClassName('property-button')) {
        let key = btn.id;
        if (btn.nodeName == 'BTNTOGGLE') {
            properties[key] = btn.pressed;
        }
    }
    updateCode();
}

function updateCode() {
    let code = document.getElementById('server-properties');
    code.innerHTML = `#Minecraft server properties
#Generated with https://matcool.github.io/server-properties
`;
    for (let key in properties) {
        if (properties.hasOwnProperty(key)) {
            let value = properties[key];
            code.innerHTML += `${key}=${value.toString()}\n`;
        }
    }
    hljs.highlightBlock(code);
}

updateProperties();