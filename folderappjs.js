let fileSystem = JSON.parse(localStorage.getItem("fileSystem")) || {
  name: "My Files",
  type: "folder",
  children: []
};

let currentFolder = fileSystem;
let pathStack = [];
let selectedIndex = null;

const fileList = document.getElementById("fileList");
const pathDiv = document.getElementById("path");
const nameInput = document.getElementById("nameInput");
const searchInput = document.getElementById("search");

// SAVE
function saveData() {
  localStorage.setItem("fileSystem", JSON.stringify(fileSystem));
}

// RENDER
function render() {
  fileList.innerHTML = "";

  pathDiv.innerText =
    currentFolder === fileSystem
      ? "⚡ My Files"
      : "⚡ My Files > " + pathStack.map(f => f.name).join(" > ");

  const filter = searchInput.value.toLowerCase();

  currentFolder.children.forEach((item, index) => {
    if (!item.name.toLowerCase().includes(filter)) return;

    const div = document.createElement("div");
    div.className = "item";

    const icon = document.createElement("div");
    icon.className = "icon";
    icon.textContent = item.type === "folder" ? "📁" : "📄";
    icon.draggable = true;

    const name = document.createElement("div");
    name.className = "name";
    name.textContent = item.name;

    // SELECT
    icon.onclick = () => {
      selectedIndex = index;
      render();
    };

    // OPEN FOLDER
    icon.ondblclick = () => {
      if (item.type === "folder") {
        pathStack.push(currentFolder);
        currentFolder = item;
        selectedIndex = null;
        render();
      }
    };

    // DRAG START
    icon.ondragstart = (e) => {
      e.dataTransfer.setData("index", index);
    };

    // DRAG OVER
    icon.ondragover = (e) => {
      e.preventDefault();
      if (item.type === "folder") {
        icon.classList.add("drag-over");
      }
    };

    icon.ondragleave = () => {
      icon.classList.remove("drag-over");
    };

    // DROP INTO FOLDER
    icon.ondrop = (e) => {
      e.preventDefault();
      icon.classList.remove("drag-over");

      const dragIndex = e.dataTransfer.getData("index");
      if (dragIndex == index) return;

      const draggedItem = currentFolder.children[dragIndex];

      if (item.type === "folder") {
        currentFolder.children.splice(dragIndex, 1);
        item.children.push(draggedItem);

        saveData();
        render();
      }
    };

    // RENAME
    name.ondblclick = (e) => {
      e.stopPropagation();

      const input = document.createElement("input");
      input.value = item.name;

      name.replaceWith(input);
      input.focus();

      input.onblur = () => {
        item.name = input.value || item.name;
        saveData();
        render();
      };

      input.onkeydown = (e) => {
        if (e.key === "Enter") input.blur();
      };
    };

    if (selectedIndex === index) {
      icon.classList.add("selected");
    }

    div.appendChild(icon);
    div.appendChild(name);
    fileList.appendChild(div);
  });

  saveData();
}

// CREATE
function createItem(type) {
  const name = nameInput.value.trim();
  if (!name) return;

  currentFolder.children.push({
    name,
    type,
    children: type === "folder" ? [] : undefined
  });

  nameInput.value = "";
  render();
}

// BACK
document.getElementById("backBtn").onclick = () => {
  if (pathStack.length === 0) return;
  currentFolder = pathStack.pop();
  render();
};

// HOME
document.getElementById("homeBtn").onclick = () => {
  currentFolder = fileSystem;
  pathStack = [];
  render();
};

// BUTTONS
document.getElementById("createFolder").onclick = () => createItem("folder");
document.getElementById("createFile").onclick = () => createItem("file");

document.getElementById("deleteBtn").onclick = () => {
  if (selectedIndex === null) return;

  currentFolder.children.splice(selectedIndex, 1);
  selectedIndex = null;
  render();
};

// ENTER KEY
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") createItem("file");
});

// SEARCH
searchInput.addEventListener("input", render);

// INIT
render();