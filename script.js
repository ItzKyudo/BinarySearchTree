class Node {
    constructor(value, x = 0, y = 0) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = x; // X-coordinate for rendering
        this.y = y; // Y-coordinate for rendering
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // Insert Node
    insert(value) {
        const newNode = new Node(value);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else if (value > current.value) {
                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            } else return; // Avoid duplicates
        }
    }

    // Delete Node
    delete(value) {
        this.root = this._deleteRec(this.root, value);
    }

    _deleteRec(node, value) {
        if (!node) return null;

        if (value < node.value) {
            node.left = this._deleteRec(node.left, value);
        } else if (value > node.value) {
            node.right = this._deleteRec(node.right, value);
        } else {
            // Node found
            if (!node.left) return node.right; // No left child
            if (!node.right) return node.left; // No right child

            // Node with two children: find the inorder successor
            node.value = this._findMin(node.right);
            node.right = this._deleteRec(node.right, node.value);
        }
        return node;
    }

    // Helper: Find the minimum value in a tree/subtree
    _findMin(node) {
        while (node.left) {
            node = node.left;
        }
        return node.value;
    }
}

const bst = new BinarySearchTree();

// Render Binary Tree
function renderTree(root, container, x = 500, y = 50, gap = 200) {
    container.innerHTML = ''; // Clear previous render
    const nodes = [];
    const lines = [];

    function traverse(node, x, y, gap) {
        if (!node) return;

        node.x = x;
        node.y = y;
        nodes.push(node);

        if (node.left) {
            lines.push({
                x1: x + 20,
                y1: y + 20,
                x2: x - gap + 20,
                y2: y + 100 + 20,
            });
            traverse(node.left, x - gap, y + 100, gap / 2);
        }

        if (node.right) {
            lines.push({
                x1: x + 20,
                y1: y + 20,
                x2: x + gap + 20,
                y2: y + 100 + 20,
            });
            traverse(node.right, x + gap, y + 100, gap / 2);
        }
    }

    traverse(root, x, y, gap);

    // Render lines
    lines.forEach((line) => {
        const lineElement = document.createElement('div');
        lineElement.className = 'line';
        const deltaX = line.x2 - line.x1;
        const deltaY = line.y2 - line.y1;
        const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

        lineElement.style.width = `${length}px`;
        lineElement.style.top = `${line.y1}px`;
        lineElement.style.left = `${line.x1}px`;
        lineElement.style.transform = `rotate(${angle}deg)`;
        container.appendChild(lineElement);
    });

    // Render nodes
    nodes.forEach((node) => {
        const nodeElement = document.createElement('div');
        nodeElement.className = 'node';
        nodeElement.textContent = node.value;
        nodeElement.style.top = `${node.y}px`;
        nodeElement.style.left = `${node.x}px`;
        container.appendChild(nodeElement);
    });
}

// Event Listeners
const container = document.querySelector('.anim');

// Insert Button
document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const insertValue = parseInt(document.getElementById('insert').value);
    if (!isNaN(insertValue)) bst.insert(insertValue);
    renderTree(bst.root, container);
    document.getElementById('insert').value = '';
});

// Delete Button
document.querySelector('form').addEventListener('click', (e) => {
    if (e.target.textContent.trim() === 'Delete') {
        e.preventDefault();
        const deleteValue = parseInt(document.getElementById('delete').value);
        if (!isNaN(deleteValue)) bst.delete(deleteValue);
        renderTree(bst.root, container);
        document.getElementById('delete').value = '';
    }
});
