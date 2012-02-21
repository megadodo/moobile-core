/*
---

name: ViewController

description: Manages a view.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- EventDispatcher

provides:
	- ViewController

...
*/

if (!window.Moobile) window.Moobile = {};

/**
 * @name  ViewController
 * @class Provides a controller used to manage a view.
 *
 * @classdesc
 *
 * [TODO: Description]
 * [TODO: Events]
 * [TODO: Options]
 *
 * @author  Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
 * @version 0.1
 */
Moobile.ViewController = new Class( /** @lends ViewController.prototype */ {

	Extends: Moobile.EventDispatcher,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_name: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_title: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_image: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewReady: false,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_viewTransition: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_parent: null,

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_children: [],

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#modal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_modal: false,

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#modalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_modalViewController: null,

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#view
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	view: null,

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#initialize
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	initialize: function(options, name) {

		this._name = name;

		this.setOptions(options);

		this.loadView();
		if (this.view) {
			this.view.addEvent('ready', this.bound('_onViewReady'));
			this.viewDidLoad();
		}

		window.addEvent('rotate', this.bound('_onWindowRotate'));

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#loadView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	loadView: function() {
		if (this.view === null) {
			this.view = new Moobile.View();
		}
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#addChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildViewController: function(viewController) {

		var viewHandler = function() {
			var view = viewController.getView();
			if (view) {
				this.view.addChild(view);
			}
		};

		return this._addChildViewControllerAt(viewController, this._children.length, viewHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#addChildViewControllerAfter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildViewControllerAfter: function(viewController, after) {

		var index = this.getChildViewControllerIndex(after);
		if (index === -1)
			return this;

		var viewHandler = function() {
			var view = viewController.getView();
			if (view) {
				var afterView = after.getView();
				if (afterView) {
					this.view.addChildAfter(view, afterView);
				}
			}
		};

		return this._addChildViewControllerAt(viewController, index + 1, viewHandler);
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#addChildViewControllerBefore
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	addChildViewControllerBefore: function(viewController, before) {

		var index = this.getChildViewControllerIndex(before);
		if (index === -1)
			return this;

		var viewHandler = function() {
			var view = viewController.getView();
			if (view) {
				var beforeView = before.getView();
				if (beforeView) {
					this.view.addChildBefore(view, beforeView);
				}
			}
		};

		return this._addChildViewControllerAt(viewController, index, viewHandler);
	},

	/**
	 * @private
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1.0
	 */
	_addChildViewControllerAt: function(viewController, index, viewHandler) {

		if (this.hasChildViewController(viewController))
			return this;

		viewController.removeFromParentViewController();

		this.willAddChildViewController(viewController);
		this._children.splice(index, 0, viewController);
		viewController.setParentViewController(this);

		if (viewHandler) {
			viewHandler.call(this)
		}

		this.didAddChildViewController(viewController);

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewController: function(name) {
		return this._children.find(function(viewController) { return viewController.getName() === name; });
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getChildViewControllerAt
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewControllerAt: function(index) {
		return this._children[index] || null;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getChildViewControllerIndex
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewControllerIndex: function(viewController) {
		return this._children.indexOf(viewController);
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getChildViewControllers: function() {
		return this._children;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#hasChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	hasChildViewController: function(viewController) {
		return this._children.contains(viewController);
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#removeChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildViewController: function(viewController, destroy) {

		if (!this.hasChildViewController(viewController))
			return this;

		this.willRemoveChildViewController(viewController);
		this._children.erase(viewController);
		viewController.setParentViewController(null);

		var view = viewController.getView();
		if (view) {
			view.removeFromParent();
		}

		this.didRemoveChildViewController(viewController);

		if (destroy) {
			viewController.destroy();
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#removeChildViewControllers
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeChildViewControllers: function(destroy) {

		var children = [];
		for (var i = 0; i < this._children.length; i++) {
			children[i] = this._children[i];
		}

		for (var i = children.length - 1; i >= 0; i--) {
			children[i].removeFromParentViewController(destroy);
		}

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#removeFromParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	removeFromParentViewController: function(destroy) {
		return this._parent
			 ? this._parent.removeChildViewController(this, destroy)
			 : false;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#presentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	presentModalViewController: function(viewController, viewTransition) {

		if (this._modalViewController)
			return this;

		this.willPresentModalViewController(viewController);

		viewController.setParentViewController(this);
		viewController.setModal(true);

		var viewToShow = viewController.getView();
		var viewToHide = this.view;
		var parentView = this.view.getParentView();

		parentView.addChild(viewToShow);

		viewTransition = viewTransition || new Moobile.ViewTransition.Cover;
		viewTransition.addEvent('start:once', this.bound('_onPresentTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onPresentTransitionCompleted'));
		viewTransition.enter(
			viewToShow,
			viewToHide,
			parentView
		);

		viewController.setViewTransition(viewTransition);

		this._modalViewController = viewController;

		return this;
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onPresentTransitionStart: function() {
		this._modalViewController.viewWillEnter();
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onPresentTransitionCompleted: function() {
		this._modalViewController.viewDidEnter();
		this.didPresentModalViewController()
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#dismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	dismissModalViewController: function() {

		if (this._modalViewController === null)
			return this;

		this.willDismissModalViewController()

		var viewToShow = this.view;
		var viewToHide = this._modalViewController.getView();
		var parentView = this.view.getParentView();

		var viewTransition = this._modalViewController.viewTransition;
		viewTransition.addEvent('start:once', this.bound('_onDismissTransitionStart'));
		viewTransition.addEvent('complete:once', this.bound('_onDismissTransitionCompleted'));
		viewTransition.leave(
			viewToShow,
			viewToHide,
			parentView
		);

		return this;
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDismissTransitionStart: function() {
		this._modalViewController.viewWillLeave();
	},

	/**
	 * @protected
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	_onDismissTransitionCompleted: function() {
		this._modalViewController.viewDidLeave();
		this._modalViewController.destroy();
		this._modalViewController = null;
		this.didDismissModalViewController();
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getName
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getName: function() {
		return this._name;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#setTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setTitle: function(title) {

		if (this._title === title)
			return this;

		if (typeof title === 'string') {
			var text = title;
			title = new Moobile.Text();
			title.setText(text);
		}

		var parent = this._title ? this._title.getParent() : null;
		if (parent) {
			parent.replaceChild(this._title, title);
		}

		this._title = title;

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getTitle
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getTitle: function() {
		return this._title;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#setImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setImage: function(image) {

		if (this._image === image)
			return this;

		if (typeof image === 'string') {
			var source = image;
			image = new Moobile.Text();
			image.setSource(source);
		}

		var parent = this._image ? this._image.getParent() : null;
		if (parent) {
			parent.replaceChild(this._image, image);
		}

		this._image = image;

		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getImage
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getImage: function() {
		return this._image;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#setModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setModal: function(modal) {
		this._modal = modal;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#isModal
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isModal: function() {
		return this._modal;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#isViewReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	isViewReady: function() {
		return this._viewReady;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getView
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getView: function() {
		return this.view;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#setViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setViewTransition: function(viewTransition) {
		this._viewTransition = viewTransition;
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getViewTransition
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getViewTransition: function() {
		return this._viewTransition;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#setParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	setParentViewController: function(viewController) {
		this.parentViewControllerWillChange(viewController);
		this._parent = viewController;
		this.parentViewControllerDidChange(viewController);
		return this;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#getParentViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	getParentViewController: function() {
		return this._parent;
	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#willAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#didAddChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didAddChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#willRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#didRemoveChildViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRemoveChildViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#parentViewControllerWillChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewControllerWillChange: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#parentViewControllerDidChange
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	parentViewControllerDidChange: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#willPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#didPresentModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didPresentModalViewController: function(viewController) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#willDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	willDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#didDismissModalViewController
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didDismissModalViewController: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#didRotateToOrientation
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	didRotateToOrientation: function(orientation) {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#viewDidLoad
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidLoad: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#viewDidBecomeReady
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidBecomeReady: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#viewWillEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewWillEnter: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#viewDidEnter
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidEnter: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#viewWillLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewWillLeave: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#viewDidLeave
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	viewDidLeave: function() {

	},

	/**
	 * @see    http://moobile.net/api/0.1/ViewController/ViewController#destroy
	 * @author Jean-Philippe Dery (jeanphilippe.dery@gmail.com)
	 * @since  0.1
	 */
	destroy: function() {

		window.removeEvent('rotate', this.bound('_onWindowRotate'));

		this.removeFromParentViewController();
		this.removeChildViewControllers(true);

		if (this._modalViewController) {
			this._modalViewController.destroy();
			this._modalViewController = null;
		}

		this.view.destroy();
		this.view = null;

		if (this._title) {
			this._title.destroy();
			this._title = null;
		}

		if (this._image) {
			this._image.destroy();
			this._image = null;
		}

		this._parent = null;
		this._children = null
		this._viewTransition = null;
	},

	_onWindowRotate: function(e) {
		this.didRotateToOrientation(e.orientationName);
	},

	_onViewReady: function() {
		if (this._viewReady === false) {
			this._viewReady = true;
			this.viewDidBecomeReady();
		}
	}

});
