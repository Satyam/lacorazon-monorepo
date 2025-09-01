#!/usr/bin/node
import { parse } from 'node-html-parser';
import { createInterface } from 'node:readline/promises';
import { stdin } from 'node:process';

const booleanAttr = [
  'allowfullscreen',
  'async',
  'autofocus',
  'autoplay',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected',
  'shadowrootclonable',
  'shadowrootdelegatesfocus',
  'shadowrootserializable',
];

const input = [];

if (stdin.isTTY)
  console.log('Press Ctrl-D or Ctrl-C (depends on the OS)  to end input');
for await (const line of createInterface({ input: stdin })) {
  input.push(line);
}

const root = parse(input.join('\n').trim(), {
  lowerCaseTagName: true, // convert tag name to lower case (hurts performance heavily)
  comment: false, // retrieve comments (hurts performance slightly)
  fixNestedATags: false, // fix invalid nested <a> HTML tags
  parseNoneClosedTags: true, // close none closed HTML tags instead of removing them
  voidTag: {
    tags: [
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ], // optional and case insensitive, default value is ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
    closingSlash: true, // optional, default false. void tag serialisation, add a final slash <br/>
  },
  blockTextElements: {
    script: true, // keep text content when parsing
    noscript: true, // keep text content when parsing
    style: true, // keep text content when parsing
    pre: true, // keep text content when parsing
  },
});

console.log('return ', processNode(root.firstChild));
process.exit();

function processNode(node) {
  switch (node.nodeType) {
    case 1: //element
      return processEl(node);
    case 3: //text
      return node.isWhitespace ? '' : `text: '${node.trimmedText}',\n`;
    default:
    //ignore the rest
  }
}

function processEl(el) {
  return `{${el.rawTagName}: {
    ${Object.keys(el.attributes)
      .map((attr) => {
        let name = attr;
        if (booleanAttr.includes(attr)) {
          return `${name}: true,`;
        }
        if (name === 'class') name = 'className';
        return `${name}: "${el.getAttribute(attr)}",`;
      })
      .join('\n')}
    ${processChildNodes(el.childNodes)}}},`;
}

function processChildNodes(children) {
  switch (children.length) {
    case 0:
      return '';
    case 1: {
      const child = children[0];
      if (child.nodeType === 3) return processNode(child);
      return `children: ${processNode(child)},\n`;
    }
    default:
      return `children: [
        ${children.map((child) => processNode(child)).join('\n')}
      ],\n`;
  }
}
