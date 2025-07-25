const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const list = $(".list");
const context = $(".context-menu");
const input = $("input");
const body = $("body");

let selected = null;
let rect = null;
let itemDlete = null;

const tree = [
    {
        type: "folder",
        name: "src",
        children: [
            {
                type: "folder",
                name: "components",
                children: [
                    { type: "file", name: "Header.js" },
                    { type: "file", name: "Footer.js" },
                    { type: "file", name: "Sidebar.js" },
                ],
            },
            {
                type: "folder",
                name: "utils",
                children: [
                    { type: "file", name: "helpers.js" },
                    { type: "file", name: "constants.js" },
                ],
            },
            { type: "file", name: "index.js" },
            { type: "file", name: "App.js" },
        ],
    },
    {
        type: "folder",
        name: "public",
        children: [
            { type: "file", name: "index.html" },
            { type: "file", name: "favicon.ico" },
        ],
    },
    {
        type: "folder",
        name: "config",
        children: [
            { type: "file", name: "webpack.config.js" },
            { type: "file", name: "babel.config.js" },
            {
                type: "folder",
                name: "environments",
                children: [
                    { type: "file", name: "dev.env.js" },
                    { type: "file", name: "prod.env.js" },
                ],
            },
        ],
    },
    {
        type: "folder",
        name: "scripts",
        children: [
            { type: "file", name: "build.js" },
            { type: "file", name: "deploy.js" },
        ],
    },
    {
        type: "folder",
        name: "tests",
        children: [
            {
                type: "folder",
                name: "unit",
                children: [
                    { type: "file", name: "App.test.js" },
                    { type: "file", name: "Utils.test.js" },
                ],
            },
            {
                type: "folder",
                name: "integration",
                children: [
                    { type: "file", name: "LoginFlow.test.js" },
                    { type: "file", name: "SignupFlow.test.js" },
                ],
            },
        ],
    },
    {
        type: "folder",
        name: "docs",
        children: [
            { type: "file", name: "README.md" },
            { type: "file", name: "CONTRIBUTING.md" },
        ],
    },
    {
        type: "folder",
        name: "build",
        children: [
            { type: "file", name: "bundle.js" },
            { type: "file", name: "main.css" },
        ],
    },
    {
        type: "folder",
        name: "logs",
        children: [
            { type: "file", name: "app.log" },
            { type: "file", name: "error.log" },
        ],
    },
    {
        type: "folder",
        name: "empty-folder",
        children: [],
    },
    // Files directly under root
    { type: "file", name: "README.md" },
    { type: "file", name: ".gitignore" },
    { type: "file", name: "package.json" },
    { type: "file", name: "vite.config.js" },
    { type: "file", name: "LICENSE" },
];

function start(tree, listItem) {
    for (let item of tree) {
        if (!item.type) return;
        const div = document.createElement("div");
        const span = document.createElement("span");
        const li = document.createElement("li");
        div.className = "wrap-item";
        li.className = "item close";
        let a = createList(item);
        span.innerText = item.name;
        if (a) {
            div.append(a, span);
        } else {
            div.appendChild(span);
        }
        li.appendChild(div);
        listItem.append(li);
        if (item.type === "folder" && item.children) {
            const ul = document.createElement("ul");
            ul.className = "children";
            li.appendChild(ul);
            start(item.children, ul);
        }
    }
}

function createList(item) {
    switch (item.type) {
        case "folder":
            const i = document.createElement("i");
            i.className = "far fa-folder-open";
            return i;
    }
}

function clickItem() {
    const li = document.querySelectorAll(".item");
    const spans = document.querySelectorAll(".wrap-item");
    spans.forEach((item) => {
        item.addEventListener("mouseover", function (e) {
            e.stopPropagation();
            if (item.classList.contains("highlight")) return;
            item.style.backgroundColor = "antiquewhite";
        });
        item.addEventListener("mouseleave", function (e) {
            e.stopPropagation();
            item.style.backgroundColor = "";
        });
        item.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            e.stopPropagation();
            selected = e.target;
            rect = selected.getBoundingClientRect();
            itemDlete = e.target.closest("li");
            context.hidden = false;
            Object.assign(context.style, {
                top: 4 + e.clientY + "px",
                left: 4 + e.clientX + "px",
            });
        });
    });
    li.forEach((item) => {
        item.addEventListener("click", function (e) {
            e.stopImmediatePropagation();
            item.classList.toggle("close");
            const span = item.querySelector("span");
            context.hidden = true;
            if (item) {
                document
                    .querySelector(".item.highlight")
                    ?.classList.remove("highlight");
                item.classList.add("highlight");
            }
        });
    });
}
context.addEventListener("click", function (e) {
    if (e.target.closest(".rename")) {
        input.hidden = false;
        setTimeout(() => input.focus(), 0);
        input.value = selected.textContent;
        input.style.position = "absolute";
        input.style.top = rect.top + window.scrollY + "px";
        input.style.left = rect.left + window.scrollX + "px";
        input.style.width = rect.width + "px";
        input.style.height = rect.height + "px";
        input.style.fontSize = "inherit";
        input.style.padding = "0";
        input.style.margin = "0";
        input.style.border = "1px solid #ccc";
        input.style.zIndex = 999;
    }
    if (e.target.closest(".delete") && confirm("Bạn có chắc chắn xóa?")) {
        itemDlete.remove();
    }
    context.hidden = true;
});
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        selected.textContent = input.value.trim() || selected.textContent;
        input.hidden = true;
    }
});
input.addEventListener("blur", function () {
    input.hidden = true;
    selected.textContent = input.value;
});

document.addEventListener("click", function (e) {
    if (body) {
        context.hidden = true;
    }
});

start(tree, list);
clickItem();
