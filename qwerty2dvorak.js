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

function inputToOutputWithCaret(input, caretPosition, caretChar = "\u2588", mappingFn = qwerty2dvorak) {
    var mapping = mappingFn();
    var output = _map(input, function(c) { return mapping[c.charCodeAt(0)] || c; });
    return {
        output: output,
        outputWithCaret: output.substring(0, caretPosition) + caretChar + output.substring(caretPosition)
    };
}

function wrapIn(content, left = "<pre><code>", right = "</code></pre>") {
    return left + content + right;
}

function caretBlock() {
    return "<span class='block'></span>";
}

var caret = caretBlock();

function updateInputOutput(elInput, elOutput) {
    var output = inputToOutputWithCaret(elInput.value, caretPos(elInput), caret);
    elOutput.rawOutput = output.output;
    elOutput.innerHTML = wrapIn(output.outputWithCaret);
}

function pluginDvorakDual(elInput, elOutput) {
    elOutput.updateCaretPosition = function (pos, caretChar = caret) {
        var output = elOutput.rawOutput;
        if (output) {
            elOutput.innerHTML = wrapIn(output.substring(0, pos) + caretChar + output.substring(pos));
        }
    };
    elInput.addEventListener("keyup", function(e){
        updateInputOutput(elInput, elOutput);
    }, false);
    elInput.addEventListener("keydown", function(e) {
        if (e.keyCode === 8) {
            updateInputOutput(elInput, elOutput);
        }
        if ([37, 38, 39, 40].indexOf(e.keyCode) >= 0) {
            elOutput.updateCaretPosition(caretPos(elInput));
        }
    }, false);
}
