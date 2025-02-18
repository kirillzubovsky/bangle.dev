/**
 * @jest-environment jsdom
 */

/** @jsx psx */
import { markdownSerializer } from '../markdown-serializer';

import {
  bold,
  code,
  italic,
  link,
  strike,
  underline,
  doc,
  paragraph,
  text,
  bulletList,
  heading,
  blockquote,
  codeBlock,
  hardBreak,
  listItem,
  orderedList,
  image,
  horizontalRule,
} from '@bangle.dev/core/components';

import { markdownParser } from '../markdown-parser';
import { SpecRegistry } from '@bangle.dev/core/spec-registry';

const specRegistry = new SpecRegistry([
  // nodes
  doc.spec(),
  paragraph.spec(),
  text.spec(),

  bulletList.spec(),
  heading.spec(),
  blockquote.spec(),
  codeBlock.spec(),
  hardBreak.spec(),
  listItem.spec(),
  orderedList.spec(),
  image.spec(),
  horizontalRule.spec(),

  // marks
  bold.spec(),
  code.spec(),
  italic.spec(),
  link.spec(),
  strike.spec(),
  underline.spec(),
]);

const serializer = markdownSerializer(specRegistry);
const parser = markdownParser(specRegistry);

export const serialize = async (doc) => {
  let content = doc;
  if (typeof doc === 'function') {
    content = doc(specRegistry.schema);
  }
  return serializer.serialize(content);
};

export const parse = async (md) => parser.parse(md);
