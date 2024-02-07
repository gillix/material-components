function format(input) {
  if (typeof input === 'number') return `${input}px`;
  return input;
}

export function stringify(styles) {
//  if (Array.isArray(classes)) return classes.map(item => stringify(item)).join(' ');
  if (typeof styles === 'object') return Object.entries(styles).map(([key, value]) => `${key}:${format(value)};`).join(' ');
  if (typeof styles === 'string') return styles;
  return '';
}

/**
 * @param node {Element}
 * @param _styles ({[key: string]: string | number})
 */
export default (node, _styles) => {
  let explicit = false;
  let styles = _styles;
  if (Array.isArray(styles)) {
    [styles, explicit] = styles;
  }
  Object.entries(styles).forEach(([key, value]) => {
    if (value) node.style.setProperty(explicit ? key : `--s-${key}`, format(value));
  });

  return {
    update(newStyles) {
      Object.entries(newStyles).forEach(([key, value]) => {
        if (value) {
          node.style.setProperty(explicit ? key : `--s-${key}`, format(value));
          delete styles[key];
        }
      });

      Object.keys(styles).forEach((name) => node.style.removeProperty(explicit ? name : `--s-${name}`));

      styles = newStyles;
    },
  };
};
