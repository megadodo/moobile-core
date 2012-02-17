/*
---

name: NavigationBarItem

description: Provides the navigation bar item that contains the title and
             buttons at the left and right of it.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- BarItem

provides:
	- NavigationBarItem

...
*/

/**
 * @name  NavigationBarItem
 * @class Provides a navigation bar item control.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Roles]
 * [TODO: Styles]
 * [TODO: Options]
 * [TODO: Element Structure]
 *
 * @extends BarItem
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.NavigationBarItem = new Class( /** @lends NavigationBarItem.prototype */ {

	Extends: Moobile.BarItem,

	/**
	 * The title.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	title: null,

	willBuild: function() {

		this.parent();

		this.element.addClass('navigation-bar-item');

		var title = this.element.getRoleElement('title');
		if (title == null) {
			title = new Element('div');
			title.ingest(this.element);
			title.inject(this.element);
			title.setRole('title');
		}

		var wrapper = this.element.getElement('.bar-title');
		if (wrapper == null) {
			wrapper = new Element('div.bar-title');
			wrapper.wraps(title);
		}
	},

	destroy: function() {
		this.title = null;
		this.parent();
	},

	/**
	 * Sets the title.
	 *
	 * This method will set the title using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} title The title as a string or a `Label` instance.
	 *
	 * @return {NavigationBarItem} This navigation bar item.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setTitle: function(title) {

		if (this.title === title)
			return this;

		if (typeof title == 'string') {
			var text = title;
			title = new Moobile.Text();
			title.setText(text);
		}

		if (this.title == null) {
			this.title = title;
			this.addChild(title, null, this.element.getElement('.bar-title'));
		} else {
			this.replaceChild(this.title, title);
			this.title.destroy();
			this.title = title;
		}

		return this;
	},

	/**
	 * Returns the title.
	 *
	 * @return {NavigationBarItemTitle} The title.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getTitle: function() {
		return this.title;
	},

	/**
	 * Adds a button at the left of the title.
	 *
	 * @see EventDispatcher#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addLeftButton: function(button) {
		return this.addChild(button, 'top');
	},

	/**
	 * Adds a button at the right of the title.
	 *
	 * @see EventDispatcher#addChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	addRightButton: function(button) {
		return this.addChild(button, 'bottom');
	},

	/**
	 * Returns a bar button.
	 *
	 * @see EventDispatcher#getChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getButton: function(name) {
		return this.getChild(name);
	},

	/**
	 * Removes a bar button.
	 *
	 * @see EventDispatcher#removeChild
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeButton: function(item) {
		return this.removeChild(item);
	},

	/**
	 * Removes all bar buttons.
	 *
	 * @see EventDispatcher#removeChildren
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	removeAllButtons: function() {
		return this.removeChildren(Moobile.Button);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('item', Moobile.NavigationBar, function(element) {
	var instance = Moobile.Component.create(Moobile.NavigationBarItem, element, 'data-item');
	this.setItem(instance);
});

Moobile.Component.defineRole('title', Moobile.NavigationBarItem, function(element) {
	var instance = Moobile.Component.create(Moobile.Text, element, 'data-title');
	this.setTitle(instance);
});
