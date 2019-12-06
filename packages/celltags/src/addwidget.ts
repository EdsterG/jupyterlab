import { Widget } from '@lumino/widgets';

import { defaultIconRegistry } from '@jupyterlab/ui-components';

import { TagTool } from './tool';

/**
 * A widget which hosts a cell tags area.
 */
export class AddWidget extends Widget {
  /**
   * Construct a new tag widget.
   */
  constructor() {
    super();
    this.addClass('tag');
    this.editing = false;
    this.buildTag();
  }

  /**
   * Create input box with icon and attach to this.node.
   */
  buildTag() {
    let text = document.createElement('input');
    text.value = 'Add Tag';
    text.contentEditable = 'true';
    text.className = 'add-tag';
    text.style.width = '49px';
    this.input = text;
    let tag = document.createElement('div');
    tag.className = 'tag-holder';
    tag.appendChild(text);
    let img = document.createElement('span');
    defaultIconRegistry.icon({
      name: 'add',
      container: img,
      center: true,
      height: '18px',
      width: '18px',
      marginLeft: '3px',
      marginRight: '-5px'
    });
    this.addClass('unapplied-tag');
    tag.appendChild(img);
    this.node.appendChild(tag);
  }

  /**
   * Handle `after-attach` messages for the widget.
   */
  onAfterAttach() {
    this.node.addEventListener('mousedown', this);
    this.input.addEventListener('keydown', this);
    this.input.addEventListener('blur', this);
  }

  /**
   * Handle `before-detach` messages for the widget.
   */
  onBeforeDetach() {
    this.node.removeEventListener('mousedown', this);
    this.input.removeEventListener('keydown', this);
    this.input.removeEventListener('blur', this);
  }

  /**
   * Handle the DOM events for the widget.
   *
   * @param event - The DOM event sent to the widget.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the dock panel's node. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
      case 'mousedown':
        this._evtMouseDown(event as MouseEvent);
        break;
      case 'keydown':
        this._evtKeyDown(event as KeyboardEvent);
        break;
      case 'blur':
        this._evtBlur();
        break;
      default:
        break;
    }
  }

  /**
   * Handle the `'mousedown'` event for the input box.
   *
   * @param event - The DOM event sent to the widget
   */
  private _evtMouseDown(event: MouseEvent) {
    if (!this.editing) {
      this.editing = true;
      this.input.value = '';
      this.input.focus();
    } else if (event.target !== this.input) {
      let value = this.input.value;
      (this.parent as TagTool).addTag(value);
      this.input.blur();
      this._evtBlur();
    }
    event.preventDefault();
  }

  /**
   * Handle the `'keydown'` event for the input box.
   *
   * @param event - The DOM event sent to the widget
   */
  private _evtKeyDown(event: KeyboardEvent) {
    let tmp = document.createElement('span');
    tmp.className = 'add-tag';
    tmp.innerHTML = this.input.value;
    // set width to the pixel length of the text
    document.body.appendChild(tmp);
    this.input.style.width = tmp.getBoundingClientRect().width + 8 + 'px';
    document.body.removeChild(tmp);
    // if they hit Enter, add the tag and reset state
    if (event.keyCode === 13) {
      let value = this.input.value;
      (this.parent as TagTool).addTag(value);
      this.input.blur();
      this._evtBlur();
    }
  }

  /**
   * Handle the `'focusout'` event for the input box.
   *
   * @param event - The DOM event sent to the widget
   */
  private _evtBlur() {
    if (this.editing) {
      this.editing = false;
      this.input.value = 'Add Tag';
      this.input.style.width = '49px';
    }
  }

  public parent: TagTool;
  private editing: boolean;
  private input: HTMLInputElement;
}
