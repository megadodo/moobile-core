/*
---

name: ButtonRoles

description: Provides the behavior for roles used in button controls.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Control

provides:
	- ButtonRoles

...
*/

Moobile.ButtonRoles = {
	
	label: {
		stop: true,
		apply: function(element) {
			var n = element.get('data-name');
			var o = element.get('data-options');
			var c = element.get('data-class') || Moobile.Label;
			return Class.instanciate(c, element, o, n);
		}
	}	
	
};
