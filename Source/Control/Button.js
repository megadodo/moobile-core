/*
---

name: Button

description: Provides a Button control.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- Button

...
*/

 /**
 * @name  Button
 * @class Provides a button control.
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
 * @extends Control
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.Button = new Class(/** @lends Button.prototype */ {

	Extends: Moobile.Control,

	/**
	 * This button's label.
	 * @type   Text
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	label: null,

	willBuild: function() {

		this.parent();

		this.element.addClass('button');

		var label = this.element.getRoleElement('label');
		if (label === null) {
			label = new Element('div');
			label.ingest(this.element);
			label.inject(this.element);
			label.setRole('label');
		}

		this.addEvent('tapstart', this.bound('onTapStart'));
		this.addEvent('tapend', this.bound('onTapEnd'));
	},

	destroy: function() {
		this.removeEvent('tapstart', this.bound('onTapStart'));
		this.removeEvent('tapend', this.bound('onTapEnd'));
		this.label = null;
		this.parent();
	},

	/**
	 * Sets the label.
	 *
	 * This method will set the label using either a string or an instance of a
	 * `Label`. When provided with a string, this methods creates a `Label`
	 * instance and assign the given string as its text.
	 *
	 * @param {Mixed} label The label as a string or a `Label` instance.
	 *
	 * @return {Button} This button.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	setLabel: function(label) {

		if (this.label === label)
			return this;

		if (typeof label === 'string') {
			var text = label;
			label = new Moobile.Text();
			label.setText(text);
		}

		if (this.label === null) {
			this.label = label;
			this.addChild(label);
		} else {
			this.replaceChild(this.label, label, true);
			this.label = label;
		}

		label.addClass('label');

		return this;
	},

	/**
	 * Returns the label.
	 *
	 * @return {Text} The label.
	 *
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	getLabel: function() {
		return this.label;
	},

	onTapStart: function(e) {
		this.setHighlighted(true);
	},

	onTapEnd: function(e) {
		this.setHighlighted(false);
	}

});

//------------------------------------------------------------------------------
// Roles
//------------------------------------------------------------------------------

Moobile.Component.defineRole('button', null, function(element) {
	var instance = Moobile.Component.create(Moobile.Button, element, 'data-button');
	this.addChild(instance);
});

Moobile.Component.defineRole('label', Moobile.Button, function(element) {
	var instance = Moobile.Component.create(Moobile.Text, element, 'data-label');
	this.setLabel(instance);
});
