#animate-scss
*Sassy just-add-water CSS animation*

`animate-sass` is a Sass version of [Dan Eden's](https://github.com/daneden) [Animate.css](https://daneden.me/animate/).

animate-sass has a couple of features to make the most of what Sass has to offer for efficient development. __Use only what you need, and keep the overhead at a minimum.__

Basically, all animations are separated into partials, and there is a separate [`settings.scss`](helpers/settings.scss) partial that allows you to only use what you need, therefore not compile and include every single animation, i.e. less overhead. 🎉

[Usage](#usage) | [Mixins](#mixins) | [Settings](#settings) | [Animation Module Loading](#animation-module-loading) | [Base Styles](#base-styles) | [Animations](#animations)

##Usage

1. Pick your animation from [Animate.css](https://daneden.github.io/animate.css/)

	For our example we'll pretend that we've chosen the BounceIn animation

2. By default *all* animations are included in wd_s, but *only one* is enabled: FadeIn. We want to to add BounceIn. Visit the [`settings.scss`](helpers/settings.scss) to enable whatever animation you've chosen, e.g. change `$use-bounceIn:	false !default;` to `$use-bounceIn:	true !default;`

3. (Optional) While you're in the `_settings.scss` take a look around, as there are a bunch of other variables you can modify for different results, e.g. `$base-duration, $base-origin, $base-timing-function-in`. Each has a sensible default set, therefore this step is optional.

4. Finally in your markup, simply add the class `animated` to an element, along with any of the animation class names.

````
<div class="animated bounceIn">
	<p>Watch me bounce in!</p>
</div>
````

or

```
.my-animated-button {
	@include animate-prefixer(animation, 'bounceIn');
}
```

That's it! You've got a CSS animated element. Super!

##Mixins
There are a couple of [Sass mixins](helpers/_mixins.scss) that some of the modules use to generate the necessary compiled css.

##Settings
The settings file defines a range of default [Sass variables](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#variables_) which are used by some of the animation modules. You can override the defaults in your own settings or style sass file(s).


###Animation Module loading
The settings file also sets all animation modules to false (nothing gets loaded).

To include an animation module in your project, simply override the $use[moduleName] variable in your own settings file to true.

By only choosing the animation modules you need, you're keeping the compiled css at it's leanest!

Eg:
````
// These will be included
$use-fadeIn: true;
$use-fadeOut: true;
````

Modules are arranged by the following animation types;

- attention-seekers
- bounce-enter
- bounce-exit
- fade-enter
- fade-exit
- flippers
- lightspeed
- rotate-enter
- rotate-exit
- special


####Base Styles

There is a small section at the bottom of the `_animate.scss` file that contains the base css rules for animate.sass to work.

Simply copy it from the `_animate.scss` file (or from the code block below) into you main sass file or base sass module.

````
body {
	-webkit-backface-visibility: hidden; // Addresses a small issue in webkit: http://bit.ly/NEdoDq
}
.animated {
	@include animate-prefixer(animation-duration, $base-duration);
	@include animate-prefixer(animation-fill-mode, both);

	&.hinge {
		@include animate-prefixer(animation-duration, $base-duration * 2);
	}
}

````

###Animations

All individual animation modules are kept in their own [Sass partials](animations/) so they can be found easily. You shouldn't need to edit these as they are part of the animate.css library.


##Learn more

You can [check out the original animate.css here](http://daneden.me/animate). See working examples as well as how to use with javascript or creating custom css classes


##Changelog

v0.1.1 initial integration of Animate.scss