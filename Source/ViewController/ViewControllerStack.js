/*
---

name: ViewControllerStack

description: Provides a way to navigate from view to view and comming back.

license: MIT-style license.

authors:
	- Jean-Philippe Dery (jeanphilippe.dery@gmail.com)

requires:
	- Core
	- Request.ViewController
	- ViewController

provides:
	- ViewControllerStack

...
*/

Moobile.ViewControllerStack = new Class({

	Extends: Moobile.ViewController,

	topViewController: null,

	viewControllers: [],
	
	viewControllerRequest: null,

	initialize: function(view) {
		this.parent(view);
		this.viewControllerRequest = new Moobile.Request.ViewController(this);
		this.view.hide();
		return this;
	},

	loadView: function(view) {
		this.view = view || new Moobile.ViewStack(new Element('div'));
	},
	
	pushViewControllerFrom: function(remote) {
		this.viewControllerRequest.cancel();
		this.viewControllerRequest.getViewController(remote);
		return this;
	},

	pushViewController: function(viewController, viewControllerTransition) {
		viewController.viewControllerStack = this;
		viewController.viewControllerPanel = this.viewControllerPanel;
		this.viewControllers.push(viewController);
		
		if (this.viewControllers.length == 1) {
			
			this.view.fade('hide');
			this.view.show();

			this.view.addChildView(viewController.view);
			viewController.doStartup();
			viewController.viewWillEnter();
			viewController.viewDidEnter();

			this.view.fade('show');

			this.window.position();

		} else {

			this.window.disableUserInput();

			var transition = viewControllerTransition || viewController.getTransition();
			if (transition && typeOf(transition) == 'class') {
				transition = Class.instanciate(transition);
			}
			
			this.view.addChildView(viewController.view);
			viewController.setTransition(transition);
			viewController.doStartup();
			viewController.viewWillEnter();

			this.viewControllers.getLast(1).viewWillLeave();

			if (transition) {
				transition.startup(viewController, this);
				transition.chain(this.bound('onPushTransitionCompleted'));
				transition.prepare('enter');
				transition.execute('enter');
			} else {
				this.onPushTransitionCompleted();
			}
		}

		this.topViewController = viewController;

		return this;
	},

	onPushTransitionCompleted: function() {
		this.viewControllers.getLast()
			.viewDidEnter();
		this.viewControllers.getLast(1)
			.viewDidLeave();

		this.window.enableUserInput();

		return this;
	},

	popViewController: function() {
		if (this.viewControllers.length) {
			this.viewControllers.getLast(1).viewWillEnter();
			this.viewControllers.getLast(0).viewWillLeave();

			this.window.disableUserInput();

			var transition = this.viewControllers.getLast().getTransition();
			if (transition) {
				transition.chain(this.bound('onPopTransitionCompleted'));
				transition.prepare('leave');
				transition.execute('leave');
			} else {
				this.onPopTransitionCompleted();
			}

			this.topViewController = this.viewControllers.getLast(1);
		}
		return this;
	},

	onPopTransitionCompleted: function() {
		this.viewControllers.getLast(1)
			.viewDidEnter();
		this.viewControllers.getLast()
			.viewDidLeave();
		this.viewControllers.pop()
			.viewDidRemove()
			.doShutdown();

		this.window.enableUserInput();
		
		return this;
	},

	getViewControllers: function() {
		return this.viewControllers;
	},

	getViewControllerAt: function(offset) {
		return this.viewControllers.getLast(offset);
	},

	getTopViewController: function() {
		return this.topViewController;
	},

	orientationDidChange: function(orientation) {
		this.viewControllers.each(function(viewController) { viewController.orientationDidChange(orientation) });
		return this.parent();
	},

	/* Prevent default behavior */

	viewWillEnter: function() {
		return this;
	},

	viewDidEnter: function() {
		return this;
	}

});