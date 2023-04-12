import { assert } from './Assertion.js';

/** Runs callback with the contents of uploaded file, when it is ready.
 * callback: (string) -> ...
 */
export default function uploadListener(callback) {
  assert(typeof callback === 'function', 'Callback is not function');
  return (changeEvent) => {
    changeEvent.target.files[0].text().then(callback);
  }
}
