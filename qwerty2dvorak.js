function qwerty2dvorak() {
    var mappings = [
        [
            "qwertyuiop",
            ";,.kyfgclz"
        ],
        [
            "asdfghjkl;",
            "aoeiudrtsn"
        ],
        [
            "zxcvbnm,./",
            "pqjhxbmwv/"
        ],
        [
            "QWERTYUIOP",
            ":<>KYFGCLZ",
        ],
        [
            "ASDFGHJKL:",
            "AOEIUDRTSN"
        ],
        [
            "ZXCVBNM<>?",
            "PQJHXBMWV?"
        ]
    ];
    var ret = {};
    for(var i = 0; i < mappings.length; i++) {
        var q2d = mappings[i];
        for(var j = 0; j < q2d[0].length; j++) {
            ret[q2d[0][j].charCodeAt(0)] = q2d[1][j];
        }
    }
    return ret;
};

function caretPos(el) {
    var pos = 0;
    if (document.selection) {
        el.focus();
        var sel = document.selection.createRange();
        var selLength = document.selection.createRange().text.length;
        sel.moveStart("character", -el.value.length);
        pos = sel.text.length - selLength;
    } else if (el.selectionStart || el.selectionStart == "0") {
        pos = el.selectionStart;
    }
    return pos;
}

function pluginDvorak(el) {
    function keyFilter(el, mapping) {
        return function(e) {
            var q = e.keyCode;
            if (q in mapping) {
                var pos = caretPos(el);
                var left = el.value.substring(0, pos);
                var right = el.value.substring(pos);
                el.value = left + mapping[q] + right;
                el.selectionStart = el.selectionEnd = pos+1;
                e.preventDefault();
                return false;
            }
            return true;
        };
    }
    el.addEventListener("keypress", keyFilter(el, qwerty2dvorak()), false);
}

function _map(array, iteratee) {
    let index = -1;
    const length = array == null ? 0 : array.length;
    const result = new Array(length);
    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result.join("");
}

function inputToOutputWithCursor(input, cursorPosition, cursorChar = "\u2588", mappingFn = qwerty2dvorak) {
    var mapping = mappingFn();
    var output = _map(input, function(c) { return mapping[c.charCodeAt(0)] || c; });
    return output.substring(0, cursorPosition) + cursorChar + output.substring(cursorPosition);
}

function updateInputOutput(elInput, elOutput) {
    elOutput.innerHTML = inputToOutputWithCursor(elInput.value, caretPos(elInput), "<span class='block'></span>");
}

function pluginDvorakDual(elInput, elOutput) {
    function keyFilter(elInput, elOutput) {
        return function(e) {
            updateInputOutput(elInput, elOutput);
        };
    }
    elInput.addEventListener("keyup", keyFilter(elInput, elOutput), false);
    // elInput.addEventListener("keypress click focus", keyFilter(elInput, elOutput), false);
    $(elInput).on('scroll', function () { $(elOutput).scrollTop($(this).scrollTop()); });
}
