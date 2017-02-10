/**
 * File editor.js.
 *
 * Theme Customizer editor enhancements for a better user experience.
 */

window.WDS_Customizer_Editor_Config = window.WDS_Customizer_Editor_Config || {};

(function( window, document, $, app, undefined ) {
	'use strict';

	/**
	 * Config from WP localization
	 * @type object
	 */
	app.l10n = window.wds_customizer_editor_config || {};

	/**
	 * Caches elements
	 *
	 * @return void
	 */
	app.cache = function() {
		app.$ = {};

		app.api = wp.customize;
	};

	/**
	 * Initialization function
	 *
	 * @return  void
	 */
	app.init = function() {
		// build cached elements
		app.cache();

		// bail early if requirements aren't met
		if ( ! app.meets_requirements() ) {
			return;
		}

		// rebind editors when a control section is clicked
		$( '.control-section').on( 'click', app.bind_editors );

		// update customizer option when tinymce is changed.
		$( '.wds-customize-text-editor' ).find( 'textarea' ).on( 'change keyup', app.editor_updated );
	};

	/**
	 * Make sure the editor updates the customize option when changed in visual mode.
	 *
	 * @return void
	 */
	app.bind_editors = function() {
		// Was needed a timeout since RTE is not initialized when this code run.
		setTimeout(function () {
			for ( var i = 0; i < tinymce.editors.length; i++ ) {
				tinymce.editors[i].onChange.add(function (ed, e) {
					// Update HTML view textarea (that is the one used to send the data to server).
					ed.save();

					// update the customize option.
					wp.customize( ed.id, function ( obj ) {
						obj.set( ed.getContent() );
					} );
                });
            }
        }, 1000);
	};

	/**
	 * Fires when the editor is changed.
	 *
	 * @param  obj evt 	JS event object.
	 * @return void
	 */
	app.editor_updated = function( evt ) {
		var $me = $( this );

		// update the customize option.
		wp.customize( this.id, function ( obj ) {
			obj.set( $me.val() );
		} );
	};

	/**
	 * Determine if requirements are met for JS bindings.
	 *
	 * @return bool True if requirements are met, false otherwise.
	 */
	app.meets_requirements = function() {
		return ( $( '.wds-customize-text-editor' ).length > 0 );
	};

	/**
	 * Safely log to the console
	 * @param  mixed str var to log
	 * @return void
	 */
	app.log = function( str ) {
		// bail early if no console
		if ( ! window.console ) {
			return;
		}

		window.console.log( str );
	};

	// fire init on document.ready
	$( document ).ready( app.init );

	return app;

})( window, document, jQuery, window.WDS_Customizer_Editor_Config );
