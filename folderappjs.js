// Root structure
let fileSystem = {
  name: "Home",
  type: "folder",
  children: []
};

// Navigation stack
let currentFolder = fileSystem;
let pathStack = [];

// Render everything
function render() {
  const fileList = document.getElementById("fileList");
  const pathDiv = document.getElementById("path");

  fileList.innerHTML = "";

  // Show path
  let pathNames = ["Home", ...pathStack.map(f => f.name)];
  pathDiv.innerText = pathNames.join(" > ");

  // Show items
  currentFolder.children.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";

    const name = document.createElement("span");
    name.innerText = item.type === "folder" ? "📁 " + item.name : "📄 " + item.name;

    // Open folder
    if (item.type === "folder") {
      name.onclick = () => openFolder(index);
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    // Rename
    const renameBtn = document.createElement("button");
    renameBtn.innerText = "✏";
    renameBtn.onclick = () => renameItem(index);

    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "🗑";
    deleteBtn.onclick = () => deleteItem(index);

    actions.appendChild(renameBtn);
    actions.appendChild(deleteBtn);

    div.appendChild(name);
    div.appendChild(actions);

    fileList.appendChild(div);
  });

  // Back button visibility
  document.getElementById("backBtn").style.display =
    pathStack.length === 0 ? "none" : "block";
}

// Create file/folder
function createItem(type) {
  const input = document.getElementById("nameInput");
  const name = input.value.trim();

  if (!name) return alert("Enter a name");

  currentFolder.children.push({
    name,
    type,
    children: type === "folder" ? [] : undefined
  });

  input.value = "";
  render();
}

// Open folder
function openFolder(index) {
  pathStack.push(currentFolder);
  currentFolder = currentFolder.children[index];
  render();
}

// Go back
function goBack() {
  currentFolder = pathStack.pop();
  render();
}

// Delete
function deleteItem(index) {
  currentFolder.children.splice(index, 1);
  render();
}

// Rename
function renameItem(index) {
  const newName = prompt("Enter new name:");
  if (!newName) return;

  currentFolder.children[index].name = newName;
  render();
}

// Initial render
render();