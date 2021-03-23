const foregroundColors = {
  '30': 'black',
  '31': 'red',
  '32': 'green',
  '33': 'yellow',
  '34': 'blue',
  '35': 'purple',
  '36': 'cyan',
  '37': 'white'
};

function ansispan(str) {

  Object.keys(foregroundColors).forEach(function (ansi) {
    var span = '<span style="color: ' + foregroundColors[ansi] + '">';

    //
    // `\u001b[Xm` == `\u001b[0;Xm` sets foreground color to `X`.
    //
    str = str.replace(
      new RegExp('\u001b\\[' + ansi + 'm', 'g'),
      span
    ).replace(
      new RegExp('\u001b\\[0;' + ansi + 'm', 'g'),
      span
    );
  });
  //
  // `\u001b[1m` enables bold font, `\u001b[22m` disables it
  //
  str = str.replace(/\u001b\[1m/g, '<b>').replace(/\u001b\[22m/g, '</b>');

  //
  // `\u001b[3m` enables italics font, `\u001b[23m` disables it
  //
  str = str.replace(/\u001b\[3m/g, '<i>').replace(/\u001b\[23m/g, '</i>');

  str = str.replace(/\u001b\[m/g, '</span>');
  str = str.replace(/\u001b\[0m/g, '</span>');
  return str.replace(/\u001b\[39m/g, '</span>');
};

export default ansispan;