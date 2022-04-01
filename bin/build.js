#!/usr/bin/env node
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import events from 'events';
import readline from 'readline';
import require$$0$1 from 'util';
import require$$0 from 'os';
import { createRequire } from 'module';

var lib = {exports: {}};

var colors = {exports: {}};

var styles = {exports: {}};

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function (module) {
var styles = {};
module['exports'] = styles;

var codes = {
  reset: [0, 0],

  bold: [1, 22],
  dim: [2, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
  hidden: [8, 28],
  strikethrough: [9, 29],

  black: [30, 39],
  red: [31, 39],
  green: [32, 39],
  yellow: [33, 39],
  blue: [34, 39],
  magenta: [35, 39],
  cyan: [36, 39],
  white: [37, 39],
  gray: [90, 39],
  grey: [90, 39],

  brightRed: [91, 39],
  brightGreen: [92, 39],
  brightYellow: [93, 39],
  brightBlue: [94, 39],
  brightMagenta: [95, 39],
  brightCyan: [96, 39],
  brightWhite: [97, 39],

  bgBlack: [40, 49],
  bgRed: [41, 49],
  bgGreen: [42, 49],
  bgYellow: [43, 49],
  bgBlue: [44, 49],
  bgMagenta: [45, 49],
  bgCyan: [46, 49],
  bgWhite: [47, 49],
  bgGray: [100, 49],
  bgGrey: [100, 49],

  bgBrightRed: [101, 49],
  bgBrightGreen: [102, 49],
  bgBrightYellow: [103, 49],
  bgBrightBlue: [104, 49],
  bgBrightMagenta: [105, 49],
  bgBrightCyan: [106, 49],
  bgBrightWhite: [107, 49],

  // legacy styles for colors pre v1.0.0
  blackBG: [40, 49],
  redBG: [41, 49],
  greenBG: [42, 49],
  yellowBG: [43, 49],
  blueBG: [44, 49],
  magentaBG: [45, 49],
  cyanBG: [46, 49],
  whiteBG: [47, 49],

};

Object.keys(codes).forEach(function(key) {
  var val = codes[key];
  var style = styles[key] = [];
  style.open = '\u001b[' + val[0] + 'm';
  style.close = '\u001b[' + val[1] + 'm';
});
}(styles));

/*
MIT License

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var hasFlag$1 = function(flag, argv) {
  argv = argv || process.argv;

  var terminatorPos = argv.indexOf('--');
  var prefix = /^-{1,2}/.test(flag) ? '' : '--';
  var pos = argv.indexOf(prefix + flag);

  return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};

/*
The MIT License (MIT)

Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var os = require$$0;
var hasFlag = hasFlag$1;

var env = process.env;

var forceColor = void 0;
if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  forceColor = false;
} else if (hasFlag('color') || hasFlag('colors') || hasFlag('color=true')
           || hasFlag('color=always')) {
  forceColor = true;
}
if ('FORCE_COLOR' in env) {
  forceColor = env.FORCE_COLOR.length === 0
    || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
  if (level === 0) {
    return false;
  }

  return {
    level: level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  };
}

function supportsColor(stream) {
  if (forceColor === false) {
    return 0;
  }

  if (hasFlag('color=16m') || hasFlag('color=full')
      || hasFlag('color=truecolor')) {
    return 3;
  }

  if (hasFlag('color=256')) {
    return 2;
  }

  if (stream && !stream.isTTY && forceColor !== true) {
    return 0;
  }

  var min = forceColor ? 1 : 0;

  if (process.platform === 'win32') {
    // Node.js 7.5.0 is the first version of Node.js to include a patch to
    // libuv that enables 256 color output on Windows. Anything earlier and it
    // won't work. However, here we target Node.js 8 at minimum as it is an LTS
    // release, and Node.js 7 is not. Windows 10 build 10586 is the first
    // Windows release that supports 256 colors. Windows 10 build 14931 is the
    // first release that supports 16m/TrueColor.
    var osRelease = os.release().split('.');
    if (Number(process.versions.node.split('.')[0]) >= 8
        && Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }

    return 1;
  }

  if ('CI' in env) {
    if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(function(sign) {
      return sign in env;
    }) || env.CI_NAME === 'codeship') {
      return 1;
    }

    return min;
  }

  if ('TEAMCITY_VERSION' in env) {
    return (/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    );
  }

  if ('TERM_PROGRAM' in env) {
    var version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2;
      case 'Hyper':
        return 3;
      case 'Apple_Terminal':
        return 2;
      // No default
    }
  }

  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }

  if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }

  if ('COLORTERM' in env) {
    return 1;
  }

  if (env.TERM === 'dumb') {
    return min;
  }

  return min;
}

function getSupportLevel(stream) {
  var level = supportsColor(stream);
  return translateLevel(level);
}

var supportsColors = {
  supportsColor: getSupportLevel,
  stdout: getSupportLevel(process.stdout),
  stderr: getSupportLevel(process.stderr),
};

var trap = {exports: {}};

(function (module) {
module['exports'] = function runTheTrap(text, options) {
  var result = '';
  text = text || 'Run the trap, drop the bass';
  text = text.split('');
  var trap = {
    a: ['\u0040', '\u0104', '\u023a', '\u0245', '\u0394', '\u039b', '\u0414'],
    b: ['\u00df', '\u0181', '\u0243', '\u026e', '\u03b2', '\u0e3f'],
    c: ['\u00a9', '\u023b', '\u03fe'],
    d: ['\u00d0', '\u018a', '\u0500', '\u0501', '\u0502', '\u0503'],
    e: ['\u00cb', '\u0115', '\u018e', '\u0258', '\u03a3', '\u03be', '\u04bc',
      '\u0a6c'],
    f: ['\u04fa'],
    g: ['\u0262'],
    h: ['\u0126', '\u0195', '\u04a2', '\u04ba', '\u04c7', '\u050a'],
    i: ['\u0f0f'],
    j: ['\u0134'],
    k: ['\u0138', '\u04a0', '\u04c3', '\u051e'],
    l: ['\u0139'],
    m: ['\u028d', '\u04cd', '\u04ce', '\u0520', '\u0521', '\u0d69'],
    n: ['\u00d1', '\u014b', '\u019d', '\u0376', '\u03a0', '\u048a'],
    o: ['\u00d8', '\u00f5', '\u00f8', '\u01fe', '\u0298', '\u047a', '\u05dd',
      '\u06dd', '\u0e4f'],
    p: ['\u01f7', '\u048e'],
    q: ['\u09cd'],
    r: ['\u00ae', '\u01a6', '\u0210', '\u024c', '\u0280', '\u042f'],
    s: ['\u00a7', '\u03de', '\u03df', '\u03e8'],
    t: ['\u0141', '\u0166', '\u0373'],
    u: ['\u01b1', '\u054d'],
    v: ['\u05d8'],
    w: ['\u0428', '\u0460', '\u047c', '\u0d70'],
    x: ['\u04b2', '\u04fe', '\u04fc', '\u04fd'],
    y: ['\u00a5', '\u04b0', '\u04cb'],
    z: ['\u01b5', '\u0240'],
  };
  text.forEach(function(c) {
    c = c.toLowerCase();
    var chars = trap[c] || [' '];
    var rand = Math.floor(Math.random() * chars.length);
    if (typeof trap[c] !== 'undefined') {
      result += trap[c][rand];
    } else {
      result += c;
    }
  });
  return result;
};
}(trap));

var zalgo = {exports: {}};

(function (module) {
// please no
module['exports'] = function zalgo(text, options) {
  text = text || '   he is here   ';
  var soul = {
    'up': [
      '̍', '̎', '̄', '̅',
      '̿', '̑', '̆', '̐',
      '͒', '͗', '͑', '̇',
      '̈', '̊', '͂', '̓',
      '̈', '͊', '͋', '͌',
      '̃', '̂', '̌', '͐',
      '̀', '́', '̋', '̏',
      '̒', '̓', '̔', '̽',
      '̉', 'ͣ', 'ͤ', 'ͥ',
      'ͦ', 'ͧ', 'ͨ', 'ͩ',
      'ͪ', 'ͫ', 'ͬ', 'ͭ',
      'ͮ', 'ͯ', '̾', '͛',
      '͆', '̚',
    ],
    'down': [
      '̖', '̗', '̘', '̙',
      '̜', '̝', '̞', '̟',
      '̠', '̤', '̥', '̦',
      '̩', '̪', '̫', '̬',
      '̭', '̮', '̯', '̰',
      '̱', '̲', '̳', '̹',
      '̺', '̻', '̼', 'ͅ',
      '͇', '͈', '͉', '͍',
      '͎', '͓', '͔', '͕',
      '͖', '͙', '͚', '̣',
    ],
    'mid': [
      '̕', '̛', '̀', '́',
      '͘', '̡', '̢', '̧',
      '̨', '̴', '̵', '̶',
      '͜', '͝', '͞',
      '͟', '͠', '͢', '̸',
      '̷', '͡', ' ҉',
    ],
  };
  var all = [].concat(soul.up, soul.down, soul.mid);

  function randomNumber(range) {
    var r = Math.floor(Math.random() * range);
    return r;
  }

  function isChar(character) {
    var bool = false;
    all.filter(function(i) {
      bool = (i === character);
    });
    return bool;
  }


  function heComes(text, options) {
    var result = '';
    var counts;
    var l;
    options = options || {};
    options['up'] =
      typeof options['up'] !== 'undefined' ? options['up'] : true;
    options['mid'] =
      typeof options['mid'] !== 'undefined' ? options['mid'] : true;
    options['down'] =
      typeof options['down'] !== 'undefined' ? options['down'] : true;
    options['size'] =
      typeof options['size'] !== 'undefined' ? options['size'] : 'maxi';
    text = text.split('');
    for (l in text) {
      if (isChar(l)) {
        continue;
      }
      result = result + text[l];
      counts = {'up': 0, 'down': 0, 'mid': 0};
      switch (options.size) {
        case 'mini':
          counts.up = randomNumber(8);
          counts.mid = randomNumber(2);
          counts.down = randomNumber(8);
          break;
        case 'maxi':
          counts.up = randomNumber(16) + 3;
          counts.mid = randomNumber(4) + 1;
          counts.down = randomNumber(64) + 3;
          break;
        default:
          counts.up = randomNumber(8) + 1;
          counts.mid = randomNumber(6) / 2;
          counts.down = randomNumber(8) + 1;
          break;
      }

      var arr = ['up', 'mid', 'down'];
      for (var d in arr) {
        var index = arr[d];
        for (var i = 0; i <= counts[index]; i++) {
          if (options[index]) {
            result = result + soul[index][randomNumber(soul[index].length)];
          }
        }
      }
    }
    return result;
  }
  // don't summon him
  return heComes(text, options);
};
}(zalgo));

var america = {exports: {}};

(function (module) {
module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    if (letter === ' ') return letter;
    switch (i%3) {
      case 0: return colors.red(letter);
      case 1: return colors.white(letter);
      case 2: return colors.blue(letter);
    }
  };
};
}(america));

var zebra = {exports: {}};

(function (module) {
module['exports'] = function(colors) {
  return function(letter, i, exploded) {
    return i % 2 === 0 ? letter : colors.inverse(letter);
  };
};
}(zebra));

var rainbow = {exports: {}};

(function (module) {
module['exports'] = function(colors) {
  // RoY G BiV
  var rainbowColors = ['red', 'yellow', 'green', 'blue', 'magenta'];
  return function(letter, i, exploded) {
    if (letter === ' ') {
      return letter;
    } else {
      return colors[rainbowColors[i++ % rainbowColors.length]](letter);
    }
  };
};
}(rainbow));

var random = {exports: {}};

(function (module) {
module['exports'] = function(colors) {
  var available = ['underline', 'inverse', 'grey', 'yellow', 'red', 'green',
    'blue', 'white', 'cyan', 'magenta', 'brightYellow', 'brightRed',
    'brightGreen', 'brightBlue', 'brightWhite', 'brightCyan', 'brightMagenta'];
  return function(letter, i, exploded) {
    return letter === ' ' ? letter :
      colors[
          available[Math.round(Math.random() * (available.length - 2))]
      ](letter);
  };
};
}(random));

/*

The MIT License (MIT)

Original Library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function (module) {
var colors = {};
module['exports'] = colors;

colors.themes = {};

var util = require$$0$1;
var ansiStyles = colors.styles = styles.exports;
var defineProps = Object.defineProperties;
var newLineRegex = new RegExp(/[\r\n]+/g);

colors.supportsColor = supportsColors.supportsColor;

if (typeof colors.enabled === 'undefined') {
  colors.enabled = colors.supportsColor() !== false;
}

colors.enable = function() {
  colors.enabled = true;
};

colors.disable = function() {
  colors.enabled = false;
};

colors.stripColors = colors.strip = function(str) {
  return ('' + str).replace(/\x1B\[\d+m/g, '');
};

// eslint-disable-next-line no-unused-vars
colors.stylize = function stylize(str, style) {
  if (!colors.enabled) {
    return str+'';
  }

  var styleMap = ansiStyles[style];

  // Stylize should work for non-ANSI styles, too
  if(!styleMap && style in colors){
    // Style maps like trap operate as functions on strings;
    // they don't have properties like open or close.
    return colors[style](str);
  }

  return styleMap.open + str + styleMap.close;
};

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
var escapeStringRegexp = function(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }
  return str.replace(matchOperatorsRe, '\\$&');
};

function build(_styles) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles;
  // __proto__ is used because we must return a function, but there is
  // no way to create a function with a different prototype.
  builder.__proto__ = proto;
  return builder;
}

var styles$1 = (function() {
  var ret = {};
  ansiStyles.grey = ansiStyles.gray;
  Object.keys(ansiStyles).forEach(function(key) {
    ansiStyles[key].closeRe =
      new RegExp(escapeStringRegexp(ansiStyles[key].close), 'g');
    ret[key] = {
      get: function() {
        return build(this._styles.concat(key));
      },
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles$1);

function applyStyle() {
  var args = Array.prototype.slice.call(arguments);

  var str = args.map(function(arg) {
    // Use weak equality check so we can colorize null/undefined in safe mode
    if (arg != null && arg.constructor === String) {
      return arg;
    } else {
      return util.inspect(arg);
    }
  }).join(' ');

  if (!colors.enabled || !str) {
    return str;
  }

  var newLinesPresent = str.indexOf('\n') != -1;

  var nestedStyles = this._styles;

  var i = nestedStyles.length;
  while (i--) {
    var code = ansiStyles[nestedStyles[i]];
    str = code.open + str.replace(code.closeRe, code.open) + code.close;
    if (newLinesPresent) {
      str = str.replace(newLineRegex, function(match) {
        return code.close + match + code.open;
      });
    }
  }

  return str;
}

colors.setTheme = function(theme) {
  if (typeof theme === 'string') {
    console.log('colors.setTheme now only accepts an object, not a string.  ' +
      'If you are trying to set a theme from a file, it is now your (the ' +
      'caller\'s) responsibility to require the file.  The old syntax ' +
      'looked like colors.setTheme(__dirname + ' +
      '\'/../themes/generic-logging.js\'); The new syntax looks like '+
      'colors.setTheme(require(__dirname + ' +
      '\'/../themes/generic-logging.js\'));');
    return;
  }
  for (var style in theme) {
    (function(style) {
      colors[style] = function(str) {
        if (typeof theme[style] === 'object') {
          var out = str;
          for (var i in theme[style]) {
            out = colors[theme[style][i]](out);
          }
          return out;
        }
        return colors[theme[style]](str);
      };
    })(style);
  }
};

function init() {
  var ret = {};
  Object.keys(styles$1).forEach(function(name) {
    ret[name] = {
      get: function() {
        return build([name]);
      },
    };
  });
  return ret;
}

var sequencer = function sequencer(map, str) {
  var exploded = str.split('');
  exploded = exploded.map(map);
  return exploded.join('');
};

// custom formatter methods
colors.trap = trap.exports;
colors.zalgo = zalgo.exports;

// maps
colors.maps = {};
colors.maps.america = america.exports(colors);
colors.maps.zebra = zebra.exports(colors);
colors.maps.rainbow = rainbow.exports(colors);
colors.maps.random = random.exports(colors);

for (var map in colors.maps) {
  (function(map) {
    colors[map] = function(str) {
      return sequencer(colors.maps[map], str);
    };
  })(map);
}

defineProps(colors, init());
}(colors));

var extendStringPrototype = {exports: {}};

(function (module) {
var colors$1 = colors.exports;

module['exports'] = function() {
  //
  // Extends prototype of native string object to allow for "foo".red syntax
  //
  var addProperty = function(color, func) {
    String.prototype.__defineGetter__(color, func);
  };

  addProperty('strip', function() {
    return colors$1.strip(this);
  });

  addProperty('stripColors', function() {
    return colors$1.strip(this);
  });

  addProperty('trap', function() {
    return colors$1.trap(this);
  });

  addProperty('zalgo', function() {
    return colors$1.zalgo(this);
  });

  addProperty('zebra', function() {
    return colors$1.zebra(this);
  });

  addProperty('rainbow', function() {
    return colors$1.rainbow(this);
  });

  addProperty('random', function() {
    return colors$1.random(this);
  });

  addProperty('america', function() {
    return colors$1.america(this);
  });

  //
  // Iterate through all default styles and colors
  //
  var x = Object.keys(colors$1.styles);
  x.forEach(function(style) {
    addProperty(style, function() {
      return colors$1.stylize(this, style);
    });
  });

  function applyTheme(theme) {
    //
    // Remark: This is a list of methods that exist
    // on String that you should not overwrite.
    //
    var stringPrototypeBlacklist = [
      '__defineGetter__', '__defineSetter__', '__lookupGetter__',
      '__lookupSetter__', 'charAt', 'constructor', 'hasOwnProperty',
      'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString',
      'valueOf', 'charCodeAt', 'indexOf', 'lastIndexOf', 'length',
      'localeCompare', 'match', 'repeat', 'replace', 'search', 'slice',
      'split', 'substring', 'toLocaleLowerCase', 'toLocaleUpperCase',
      'toLowerCase', 'toUpperCase', 'trim', 'trimLeft', 'trimRight',
    ];

    Object.keys(theme).forEach(function(prop) {
      if (stringPrototypeBlacklist.indexOf(prop) !== -1) {
        console.log('warn: '.red + ('String.prototype' + prop).magenta +
          ' is probably something you don\'t want to override.  ' +
          'Ignoring style name');
      } else {
        if (typeof(theme[prop]) === 'string') {
          colors$1[prop] = colors$1[theme[prop]];
          addProperty(prop, function() {
            return colors$1[prop](this);
          });
        } else {
          var themePropApplicator = function(str) {
            var ret = str || this;
            for (var t = 0; t < theme[prop].length; t++) {
              ret = colors$1[theme[prop][t]](ret);
            }
            return ret;
          };
          addProperty(prop, themePropApplicator);
          colors$1[prop] = function(str) {
            return themePropApplicator(str);
          };
        }
      }
    });
  }

  colors$1.setTheme = function(theme) {
    if (typeof theme === 'string') {
      console.log('colors.setTheme now only accepts an object, not a string. ' +
        'If you are trying to set a theme from a file, it is now your (the ' +
        'caller\'s) responsibility to require the file.  The old syntax ' +
        'looked like colors.setTheme(__dirname + ' +
        '\'/../themes/generic-logging.js\'); The new syntax looks like '+
        'colors.setTheme(require(__dirname + ' +
        '\'/../themes/generic-logging.js\'));');
      return;
    } else {
      applyTheme(theme);
    }
  };
};
}(extendStringPrototype));

(function (module) {
var colors$1 = colors.exports;
module['exports'] = colors$1;

// Remark: By default, colors will add style properties to String.prototype.
//
// If you don't wish to extend String.prototype, you can do this instead and
// native String will not be touched:
//
//   var colors = require('colors/safe);
//   colors.red("foo")
//
//
extendStringPrototype.exports();
}(lib));

var version = "1.235.0";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const emitter = new events.EventEmitter();
const require = createRequire(import.meta.url); // not avail otherwise

const IS_DEV_MODE = false;

//#region //*____________________ HELPER FUNCTIONS ____________________
const RandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const Sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MoveCursorToStart = () => (process.stdout.moveCursor(-1000, 0));
const MoveCursorToNewLine = () => (process.stdout.moveCursor(-1000, 1));

const FlashingText = async(text) => {
	MoveCursorToNewLine();

	for (let idx = 0; idx < 3; idx++) {
		process.stdout.write(text.cyan);
		await Sleep(150);
		process.stdout.clearLine();
		MoveCursorToStart();
		process.stdout.write("");
		await Sleep(50);
	}

	MoveCursorToStart();
	process.stdout.write(text.cyan);
	process.stdout.moveCursor(-1000, 2);
};

const Run = (cmd, cwd) => new Promise((resolve, reject) => {
	const commands = cmd.split(" ");
	const stdoutLogs = [], stderrLogs = [];

	//* SPAWN TAKES ARGS 1) cmd, args, cwd (dir) i.e. node -v  thisdirectory
	const task = spawn(
		commands[0],
		commands.flatMap((c, idx) => idx? c : []),
		{ cwd: cwd || "" }
	);
	
	//* PUSH STREAMING DATA TO ARRAYS IN CHUNKS
	task.stdout.on("data", d => {
		stdoutLogs.push(d); // * Regular data
	});
	task.stderr.on("data", d => {
		stderrLogs.push(d); // * Errors
	});
	task.on("exit", () => {
		// * If stdoutLogs contains data, log it
		if (stdoutLogs.length && IS_DEV_MODE) console.log(stdoutLogs.map(s => s).join("\n"));
		// * Same with error logs
		if (stderrLogs.length) console.log(`[stderrLogs]: ${ stderrLogs.map(s => s).join("\n") }`);
		
		// * Function should return the value retrieved from the command line
		resolve(stdoutLogs);
	});
});

//const RunASync = async(cmd, cwd) => Run(cmd, cwd);
//#endregion
/*================================================================================
END OF HELPER FUNCTIONS
================================================================================*/

const TASKS = {
	INTRO_COMPLETE         : "intro-complete",
	CHECKS_COMPLETE        : "checks-complete",
	INIT_COMPLETE          : "init-complete",
	PACKAGE_JSON_UPDATED   : "package-json-updated",
	FILES_COPIED           : "files-copied",
	GIT_INITIALISED        : "git-initialised",
	DEPENDENCIES_INSTALLED : "dependencies-installed"
};

//#region //*____________________ INTRO ____________________
const Intro = async() => {

	const raidenIntro = {
		text: [
			"     ____   ___    _____  ____   ______ _   __",
			"    / __ | /   |  /_  _/ / __ | / ____// | / /",
			"   / /_/ // /| |   / /  / / / // __/  /  |/ / ",
			"  / _, _// ___ | _/ /_ / /_/ // /___ / /|  /  ",
			" /_/ |_|/_/  |_|/____//_____//_____//_/ |_/   ",
		],
		get lineCount() {
			return this.text.length;
		},
		get charCount() {
			return this.text[0].length;
		},
		get firstCharPositions() {
			return this.text.map(ln => {
				for (let i = 0; i < ln.length; i++) {
					if (ln[i] !== " " && ln[i] !== ".") return i;
				}
			});
		}
	};

	//* This loop handles the effect going left to right
	for (let effectIdx = 0; effectIdx < raidenIntro.charCount; effectIdx++) {
		// * Loop over the lines one by one
		for (let lineIdx = 0; lineIdx < raidenIntro.lineCount; lineIdx++) {
			const line = raidenIntro.text[lineIdx];
			const pos = raidenIntro.firstCharPositions[lineIdx] + effectIdx;
			process.stdout.write(line.substring(0, pos).grey);
			process.stdout.write(line.substring(pos, pos + 1).cyan);
			process.stdout.write(line.substring(pos + 1).grey);
			MoveCursorToNewLine();
		}

		// * Only reset cursor if not finished
		//if (effectIdx < raidenIntro.charCount - 1) {
		process.stdout.moveCursor(-1000, -raidenIntro.lineCount);
		//}
		await Sleep(20);
	}

	raidenIntro.text.map(line => {
		process.stdout.write(line.cyan);
		MoveCursorToNewLine();
	});

	//* This loop handles the typewriter caption
	process.stdout.moveCursor(-1000, 1); // down by 1
	process.stdout.write(` V${ version }`.cyan);
	MoveCursorToNewLine();
	
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const caption = " by Pete Savva @ techandtribal.com";

	for (let idx = 0; idx < caption.length; idx++) {
		for (let effectCount = 0; effectCount < RandomBetween(3,15); effectCount++) {
			const str = caption.substring(0, idx) + alphabet[RandomBetween(0, 25)];
			process.stdout.moveCursor(-1000, 0);
			process.stdout.write(str.cyan);
			await Sleep(RandomBetween(10));
		}

		await Sleep(5);
	}

	process.stdout.moveCursor(-1000, 0);
	process.stdout.write(caption.cyan);
	process.stdout.moveCursor(-1000, 2);

	emitter.emit(TASKS.INTRO_COMPLETE);
};
Intro();

//#endregion
/*================================================================================
END OF INTRO
================================================================================*/

//*____________________ BEGIN PROGRAM ____________________
let projectName = process.argv[2]; //* ARGS PASSED IN FROM COMMAND LINE

emitter.on(TASKS.INTRO_COMPLETE, () => {
	// TODO ensure passed in lowercase and with no numbers or next js will reject ?
	if (projectName !== null && projectName !== undefined) {
		process.stdout.write("Name is ok".cyan);
		emitter.emit(TASKS.CHECKS_COMPLETE);
	} else {
		process.stdout.write("Name is not ok".red);

		const rl = readline.createInterface({
			input  : process.stdin,
			output : process.stdout
		});

		rl.question("What is the name of your app?  ", (inp) => {
			if (typeof inp === "string") {
				projectName = inp;
				rl.close();
			} else {
				process.stdout.write("Strings only".red);
				process.exit();
			}
		});

		rl.on("close", () => {
			emitter.emit(TASKS.CHECKS_COMPLETE);
		});
	}
});

//* INIT
emitter.on(TASKS.CHECKS_COMPLETE, () => {
	process.stdout.write(`\nCreating project '${ projectName }'`.magenta);

	Run("node -v", false).then(nodeVersion => {
		Run("npm -v", false).then(npmVersion => {
			process.stdout.write(`\n\nNode: '${ nodeVersion }'. NPM: '${ npmVersion }'`.cyan);
			
			// * CREATE DIRECTORIES
			process.stdout.write("\n\nCreating directories".magenta);
			Run(`mkdir ${ projectName }`, false).then(() => {
				Run("mkdir public", projectName).then(() => {
					Run("mkdir public/fonts", projectName);
				});
				Run("mkdir src", projectName).then(() => {
					Run("mkdir src/pages", projectName);
				});
				Run("mkdir styles", projectName);
				Run("npm init -f", projectName).then(() => {
					emitter.emit(TASKS.INIT_COMPLETE);
				});
			});
		});
	});
});

//* AMEND PACKAGE JSON
emitter.on(TASKS.INIT_COMPLETE, () => {
	process.stdout.write("\nUpdating package.json".magenta);

	// * GRAB THE NEWLY CREATED PACKAGE.JSON FILE
	const packageJsonFile = `${ process.cwd() }/${ projectName }/package.json`;
	let data = require(packageJsonFile);

	// TODO does stringify fuck up the true?
	// TODO switch to package read method instead?
	data = {
		...data,
		author      : "Pete Savva <p.savva@protonmail.ch> (https://techandtribal.com)",
		description : "NextJS app built by Raiden",
		license     : "ISC",
		private     : true,
		homepage    : `https://github.com/baufometic/${ projectName }#readme`,
		repository  : {
			"type" : "git",
			"url"  : `https://github.com/baufometic/${ projectName }.git`,
		},
		bugs: {
			"url": `https://github.com/baufometic/${ projectName }/issues`,
		},
		scripts: {
			"cleanup"     : "rm -rf .next",
			"dev:cleanup" : "npm run cleanup && next dev",
			"dev"         : "next dev",
			"build"       : "next build",
			"start"       : "next start",
			"lint"        : "next lint",
			"test"        : "jest",
			"test:watch"  : "jest --watch"
		}
	};

	delete data.main;
	delete data.keywords;
	const dataStringified = JSON.stringify(data, null, 4);
	fs.writeFile(packageJsonFile, dataStringified, err => err || true);
	process.stdout.write("\nDone".cyan);
	emitter.emit(TASKS.PACKAGE_JSON_UPDATED);
});

//* COPY FILES - this will cover all except those which cover
emitter.on(TASKS.PACKAGE_JSON_UPDATED, () => {
	const filesToCopy = [
		{ name: ".env", hasCopied: false },
		{ name: ".eslintrc.json", hasCopied: false },
		{ name: "next-env.d.ts", hasCopied: false },
		{ name: "next.config.js", hasCopied: false },
		{ name: "README.md", hasCopied: false },
		{ name: "tsconfig.json", hasCopied: false },
		{ name: "public/favicon.ico", hasCopied: false },
		{ name: "public/raiden.jpg", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.eot", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.svg", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.ttf", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.woff", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-300.woff2", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.eot", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.svg", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.ttf", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.woff", hasCopied: false },
		{ name: "public/fonts/alegreya-sans-v20-latin-regular.woff2", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.eot", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.svg", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.ttf", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.woff", hasCopied: false },
		{ name: "public/fonts/gruppo-v14-latin-regular.woff2", hasCopied: false },
		{ name: "src/pages/_app.tsx", hasCopied: false },
		{ name: "src/pages/_document.tsx", hasCopied: false },
		{ name: "src/pages/index.tsx", hasCopied: false },
		{ name: "styles/globals.css", hasCopied: false },
	];

	const pathToSourceFiles = path.join(__dirname, "../filesToCopy/");
	process.stdout.write(`\n\nCopying files from ${ pathToSourceFiles }`.magenta);
	
	for (let idx = 0; idx < filesToCopy.length; idx++) {
		const sourceFile = pathToSourceFiles + filesToCopy[idx].name;
		const destinationFile = path.join(projectName, filesToCopy[idx].name);
	
		fs.copyFile(sourceFile, destinationFile, (err) => {
			if (err) {
				process.stdout.write("Error copying file".red);
				throw err;
			} else {
				filesToCopy[idx].hasCopied = true;
				const noOfCopiedFiles = filesToCopy.filter(file => file.hasCopied).length;
				process.stdout.write(`\nCopied [${ noOfCopiedFiles }/${ filesToCopy.length }] ${ filesToCopy[idx].name }`.cyan);
				
				if (noOfCopiedFiles === filesToCopy.length) {
					FlashingText("File copying complete").then(() => {
						emitter.emit(TASKS.FILES_COPIED);
					});
				}
			}
		});
	}
});

//* INITIALISE GIT IN REPO
emitter.on(TASKS.FILES_COPIED, () => {
	process.stdout.write("\n\nInitialising Git".magenta);

	Run("git init", projectName).then(() => {
		FlashingText("Git initialised").then(() => {
			emitter.emit(TASKS.GIT_INITIALISED);
		});
	});
});

//* INSTALL DEPENDENCIES
emitter.on(TASKS.GIT_INITIALISED, () => {
	const dependencies = [
		"@techandtribal/combronents",
		"@techandtribal/maximilian",
		"@fortawesome/fontawesome-svg-core",
		"@fortawesome/free-brands-svg-icons",
		"@fortawesome/free-regular-svg-icons",
		"@fortawesome/free-solid-svg-icons",
		"@fortawesome/react-fontawesome",
		"@supabase/supabase-js",
		"next",
		"nodemailer",
		"react",
		"react-dom",
		"styled-components",
	];

	const devDependencies = [
		"@testing-library/jest-dom",
		"@testing-library/react",
		"@testing-library/user-event",
		"@types/jest",
		"@types/node",
		"@types/nodemailer",
		"@types/react",
		"@types/react-dom",
		"@types/styled-components",
		"eslint",
		"eslint-config-next",
		"eslint-import-resolver-typescript",
		"@typescript-eslint/eslint-plugin",
		"@typescript-eslint/parser",
		"eslint-plugin-import",
		"eslint-plugin-jsx-a11y",
		"eslint-plugin-react",
		"eslint-plugin-react-hooks",
		"jest",
		"typescript",
	];

	process.stdout.write("\n\nInstalling dependencies".magenta);
	Run(`npm i ${ dependencies.map(d => d).join(" ") }`, projectName).then(() => {
		MoveCursorToNewLine();
		FlashingText("Dependencies installed").then(() => {
			process.stdout.write("\n\nInstalling dev dependencies".magenta);
			Run(`npm i -D ${ devDependencies.map(d => d).join(" ") }`, projectName).then(() => {
				MoveCursorToNewLine();
				FlashingText("Dev dependencies installed").then(() => {
					emitter.emit(TASKS.DEPENDENCIES_INSTALLED);
				});
			});
		});
	});
});

//* EXECUTE 'NPM RUN DEV'
emitter.on(TASKS.DEPENDENCIES_INSTALLED, () => {
	process.stdout.write(`\n\nProject ${ projectName } created`.cyan);
	process.stdout.write("\nStarting server on port 3000".cyan);
	Run("npm run dev", projectName);
});
