const input = document.querySelector("#inputBox");
const keys = document.querySelectorAll(".key");
const equalsTo = document.querySelector("#equal");
const del = document.querySelector("#del");
const clear = document.querySelector("#clear");

let itemStack = [];

function display() {
    input.value = ""
    for (let i = 0; i < itemStack.length; i++) {
        input.value = input.value + itemStack[i].data;
    }
}

function deleteElement() {
    if (itemStack.length === 0) {
        input.value = "";
        return;
    }
    const lastIdx = itemStack.length - 1;
    if (itemStack[lastIdx].type === 'OPERATOR') {
        itemStack.pop();
    } else {
        const lastData = itemStack[lastIdx].data;
        if (lastData.length < 2) itemStack.pop();
        else {
            itemStack[lastIdx].data = lastData.substring(0, lastData.length - 1);
        }
    }

    display();
}

function solution() {
    if (itemStack[itemStack.length - 1].type === 'OPERATOR' && itemStack[itemStack.length - 1].data != '-') {
        return;
    }
    if (itemStack.length < 3) {
        if (itemStack.length < 2) {
            if (itemStack[0].data === '-') return;
            return itemStack[0].data;
        }
        if (itemStack[0].data === '-' && itemStack[1].type === 'NUMBER') {
            const ans = itemStack[0].data + itemStack[1].data;
            return ans;
        }
        return;
    }

    for (let i = 0; i < itemStack.length; i++) {
        if (itemStack[i].data === '/') {
            const left = parseFloat(itemStack[i - 1].data);
            const right = parseFloat(itemStack[i + 1].data);
            itemStack[i - 1].data = `${left / right}`;
            itemStack.splice(i, 2);
            i--;
        }
    }

    for (let i = 0; i < itemStack.length; i++) {
        if (itemStack[i].data === 'x') {
            const left = parseFloat(itemStack[i - 1].data);
            const right = parseFloat(itemStack[i + 1].data);
            itemStack[i - 1].data = `${left * right}`;
            itemStack.splice(i, 2);
            i--;
        }
    }

    let left = 0;
    if (itemStack[0].data !== "-") {
        left = parseFloat(itemStack[0].data);
    }

    for (let i = 0; i < itemStack.length - 1; i++) {
        const op = itemStack[i].data;
        if (op === '+') {
            const right = parseFloat(itemStack[i + 1].data);
            left += right;
        } else if (op === '-') {
            const right = parseFloat(itemStack[i + 1].data);
            left -= right;
        }
    }
    return left;
}

function handleClick(key) {
    const type = key.dataset.type;
    const value = key.dataset.value;

    if (type === 'NUMBER') {
        if (itemStack.length === 0) {
            const element = {
                data: value,
                type: type
            }
            itemStack.push(element);
        } else {
            const lastIndex = itemStack.length - 1;
            if (itemStack[lastIndex].type === 'OPERATOR') {
                const element = {
                    data: value,
                    type: type
                }
                itemStack.push(element);
            } else {
                const data = itemStack[lastIndex].data;
                if (value === "." && data.includes(".")) return;
                itemStack[lastIndex].data = data + value;
            }
        }
    } else {
        if (itemStack.length === 0) {
            if (key.dataset.value === '-') {
                const element = {
                    data: value,
                    type: type
                }
                itemStack.push(element);
            }
        } else {
            const lastIndx = itemStack.length - 1;
            if (itemStack[lastIndx].type === 'OPERATOR') {
                itemStack[lastIndx].data = value;
            } else {
                const element = {
                    data: value,
                    type: type
                }
                itemStack.push(element);
            }
        }
    }
    display();
}

for (let i = 0; i < keys.length; i++) {
    keys[i].addEventListener("click", () => {
        handleClick(keys[i]);
    });
}

equalsTo.addEventListener("click", () => {
    const answer = solution();
    if (answer || answer === 0) {
        input.value = answer;
        itemStack = [];
        if (answer != Infinity && answer != -Infinity) {
            const element = {
                data: answer.toString(),
                type: 'NUMBER'
            }
            itemStack.push(element);
        } else {
            input.value = "";
            alert("Can't divided by 0");
        }
    } else {
        alert("Enter a number");
    }
});

del.addEventListener("click", deleteElement);

clear.addEventListener("click", () => {
    itemStack = [];
    input.value = "";
})