/**
 * @jest-environment jsdom
 */

/** @jsx psx */
import {
  psx,
  typeText,
  sendKeyToPm,
  renderTestEditor,
} from '@bangle.dev/core/test-helpers/index';

import { corePlugins } from '@bangle.dev/core/utils/core-components';
import { trailingNode } from '../index';
import { SpecRegistry } from '@bangle.dev/core/spec-registry';
import { defaultSpecs } from '@bangle.dev/core/test-helpers/default-components';
import { toggleHeadingCollapse } from '@bangle.dev/core/components/heading';

const specRegistry = new SpecRegistry([
  ...defaultSpecs(),
  trailingNode.spec({}),
]);
const plugins = [...corePlugins(), trailingNode.plugins({})];

const testEditor = renderTestEditor({
  specRegistry,
  plugins,
});

test('Does not add trailing node when typing paragraphs', async () => {
  const { view } = await testEditor(
    <doc>
      <para>foo[]bar</para>
    </doc>,
  );

  typeText(view, 'hello');
  sendKeyToPm(view, 'Enter');
  typeText(view, 'lastpara');

  expect(view.state).toEqualDocAndSelection(
    <doc>
      <para>foohello</para>
      <para>lastpara[]bar</para>
    </doc>,
  );
});

test('creates an empty para below Heading', async () => {
  const { view } = await testEditor(
    <doc>
      <para>foobar[]</para>
    </doc>,
  );

  sendKeyToPm(view, 'Enter');
  typeText(view, '# heading');

  expect(view.state).toEqualDocAndSelection(
    <doc>
      <para>foobar</para>
      <heading>heading</heading>
      <para></para>
    </doc>,
  );
});

test('Trailing node and collapsible heading', async () => {
  const original = (
    <doc>
      <heading level={2}>a[]b</heading>
      <para>hello</para>
      <para>abcd</para>
      <heading level={3}>bye</heading>
      <para>end</para>
      <para></para>
    </doc>
  );
  const { view } = testEditor(original);
  toggleHeadingCollapse()(view.state, view.dispatch);
  toggleHeadingCollapse()(view.state, view.dispatch);
  expect(view.state).toEqualDocAndSelection(original);

  toggleHeadingCollapse()(view.state, view.dispatch);
  toggleHeadingCollapse()(view.state, view.dispatch);
  expect(view.state).toEqualDocAndSelection(original);

  toggleHeadingCollapse()(view.state, view.dispatch);
  toggleHeadingCollapse()(view.state, view.dispatch);
  expect(view.state).toEqualDocAndSelection(original);
});
