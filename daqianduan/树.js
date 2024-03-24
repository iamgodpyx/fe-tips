root = {
    val: 2,
    left: {
        val: 2,
        left: null,
        right: {
            val: 5,
            left: null,
            right: null
        }
    },
    right: {
        val: 3,
        left: null,
        right: {
            val: 4,
            left: null,
            right: null
        }
    }
}


function first(root, res = []) {
    if (root === null) {
        return res;
    }

    res.push(root.val);
    first(root.left, res);
    first(root.right, res);
    return res;
}

function mid(root, res = []) {
    if (root === null) {
        return res;
    }

    mid(root.left, res);
    res.push(root.val);
    mid(root.right, res);
    return res;
}

function last(root, res = []) {
    if (root === null) {
        return res;
    }

    last(root.left, res);
    last(root.right, res);
    res.push(root.val);
    return res;
}

a = first(root)

console.log(a);