Template7.registerHelper('moment', function (timestamp) {
    if (typeof timestamp === 'function') timestamp = timestamp.call(this);
    var m = moment(timestamp);
    return m.fromNow();
});

Template7.registerHelper('randomColorName', function (_classname) {
    if (typeof _classname === 'function') _classname = _classname.call(this);
    return `${_classname}-${app.methods.getRandomColor()}`;
});

Template7.registerHelper('returnOkColor', function (_condition, options) {
    var _classString = "text-color";
    var ok_Color = "green";
    var false_color = "grey";

    if (_condition === 1) {
        return `${_classString}-${ok_Color}`;
    }
    return `${_classString}-${false_color}`;
});

Template7.registerHelper('capitalLetter', function (string) {
    return string.charAt(0).toUpperCase();
});

Template7.registerHelper('defineUserType', function (type) {
    return hookapi.Users.defineUserType(type);
});

Template7.registerHelper('getIndexObject', function (object, name, options) {
    var keys = Object.keys(object[options]);
    var index = keys.indexOf(name);
    return index + 1;
});

Template7.registerHelper('getIndexObjectOrdinal', function (object, name, options) {
    var keys = Object.keys(object[options]);
    var index = keys.indexOf(name);
    return get_ordinal_text(index + 1, "m");
});

Template7.registerHelper('ordinal', function (number, gender) {
    return get_ordinal_text(number, gender);
});

Template7.registerHelper('js_includes', function (context, compare, options) {
    if (typeof context === 'function') context = context.call(this);
    var fnTrue = options.fn,
        fnFalse = options.inverse;

    return context.includes(compare) ? fnTrue(this) : fnFalse(this);
});

Template7.registerHelper('find', function (context, compare, value, options) {
    if (typeof context === 'function') context = context.call(this);

    var fnTrue = options.fn,
        fnFalse = options.inverse;

    var found = context.find(function (arr) {
        return arr[compare] === value
    });
    return found ? fnTrue(found) : fnFalse(this);
});

Template7.registerHelper('indexOf', function (array, key, options) {
    if (typeof array === 'function') array = array.call(this);

    var fnTrue = options.fn,
        fnFalse = options.inverse;

    var found = array.indexOf(key);
    return found < 0 ? fnTrue(this) : fnFalse(this);
});

function get_ordinal_text(number, gender) {
    var ordinalTextMapping = [
        // unidades
        ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'septimo', 'octavo', 'noveno'],
        // decenas
        ['', 'décimo', 'vigésimo', 'trigésimo', 'cuadragésimo', 'quincuagésimo', 'sexagésimo', 'septuagésimo', 'octagésimo', 'nonagésimo'],
        // centenas
        ['', 'centésimo', 'ducentésimo', 'tricentésimo', 'cuadrigentésimo', 'quingentésimo', 'sexcentésimo', 'septingentésimo', 'octingentésimo', 'noningentésimo']
    ];

    var ordinal = ''
    var digits = [...number.toString()]
    digits.forEach((digit, i) => {
        let digit_ordinal = ordinalTextMapping[digits.length - i - 1][digit]
        if (!digit_ordinal) return
        if (gender === 'f') digit_ordinal = digit_ordinal.substr(0, [digit_ordinal.length - 1]) + 'a'
        ordinal += digit_ordinal + ' '
    });
    var text = ordinal.trim();
    return text.charAt(0).toUpperCase() + text.slice(1);
}