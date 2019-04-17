function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
function hasAttribute(attrlist, attr) {
    return attrlist[attr] !== undefined;
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

for (let btn of document.querySelectorAll('btnChoice')) {
    let choices = [];
    for (let child of btn.children) {
        if (child.nodeName == 'CHOICE') {
            choices.push(child);
            if (hasAttribute(child.attributes, 'default')) btn.selected = child;
        }
    }
    btn.innerHTML = `<div class="dropdown">
    <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Loading
    </button>
    <div class="dropdown-menu"></div>
</div>`;
    btn.children[0].children[0].innerHTML = btn.selected.innerHTML;
    for (let choice of choices) {
        let option = document.createElement('a');
        option.href = '#';
        option.classList.add('dropdown-item');
        option.innerHTML = choice.innerHTML;
        option.onclick = () => {
            btn.selected = choice;
            btn.children[0].children[0].innerHTML = btn.selected.innerHTML;
        };
        btn.children[0].children[1].appendChild(option);
    }
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
        } else if (btn.nodeName == 'BTNCHOICE') {
            properties[key] = btn.selected.attributes.value.value;
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